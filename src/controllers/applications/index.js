// @flow
import boom from 'boom';
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import internshipRepo from 'repositories/internships';
import * as internshipServices from 'services/internships';
import repo from 'repositories/applications';
import { statusTypes } from 'models/Application';

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { internshipId } = request.payload;
  return Promise.all([
    internshipRepo.retrieveOne({
      id: internshipId,
    }).then((internship) => {
      if (!internship.isActive()) {
        throw boom.badRequest('Internship is not Active');
      }
    }),
    internshipServices.doesUserOwnInternship(userId, internshipId).then((result) => {
      if (result) {
        throw boom.badRequest('You cannot apply to your own internship');
      }
    }),
    repo.retrieve({
      internshipId,
      ['!status']: [statusTypes.PENDING, statusTypes.OFFERED],
    }).then((application) => {
      if (application) {
        throw boom.badRequest('You have already applied for this internship');
      }
    }),
  ]).then(() => {
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

export default controller('applications', [
  create,
]);
