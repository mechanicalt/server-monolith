// @flow
import boom from 'boom';
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import { types } from 'hapi-utils/rpc/emails';
import internshipRepo from 'repositories/internships';
import * as internshipServices from 'services/internships';
import repo from 'repositories/applications';
import { statusTypes } from 'models/Application';
import * as rpcEmail from 'rpc/projects/emails';
import * as rpcUsers from 'rpc/projects/users';

export function byInternshipHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { id: internshipId } = request.params;
  let results;
  if (internshipServices.doesUserOwnInternship(userId, internshipId)) {
    results = repo.retrieveAll({
      internshipId,
    });
  } else {
    results = repo.retrieveAll({
      userId,
      internshipId,
    });
  }
  return results.then(reply).catch(reply);
}

export const byInternship = {
  method: 'POST',
  path: '/by_internship/{id}',
  handler: byInternshipHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export function indexHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  return repo
    .retrieveAll({
      userId,
    })
    .then(reply)
    .catch(reply);
}

export const index = {
  method: 'GET',
  path: '',
  handler: indexHandler,
};

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { internshipId } = request.payload;
  return Promise.all([
    internshipRepo.getInternshipWithUserId(internshipId).then(internship => {
      if (internship.userId === userId) {
        throw boom.badRequest('You cannot apply to your own internship');
      }
      return internship;
    }),
    internshipRepo
      .retrieveOne({
        id: internshipId,
      })
      .then(internship => {
        if (!internship.isActive()) {
          throw boom.badRequest('Internship is not Active');
        }
      }),
    repo
      .retrieve({
        internshipId,
        status: [statusTypes.PENDING, statusTypes.OFFERED],
      })
      .then(application => {
        if (application) {
          throw boom.badRequest('You have already applied for this internship');
        }
      }),
  ])
    .then(([internship]) => {
      rpcUsers
        .getUsers([userId, internship.userId])
        .then(([applicant, owner]) =>
          rpcEmail.sendEmail(
            types.createApplication,
            { to: owner.email, subject: 'Menternship - New Applicant' },
            {
              username: applicant.username,
              internshipName: internship.name,
              internshipApplicationsUrl: `${
                process.env.CLIENT_URL
              }/applicants/${internship.id}`,
            }
          )
        );
      return repo.insert({
        userId,
        internshipId,
        status: statusTypes.PENDING,
      });
    })
    .then(reply)
    .catch(reply);
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
  config: {
    validate: {
      payload: {
        internshipId: joi.string().required(),
      },
    },
  },
};

export default controller('applications', [create, byInternship, index]);
