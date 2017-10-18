// @flow
import boom from 'boom';
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import internshipRepo from 'repositories/internships';
import * as internshipServices from 'services/internships';
import repo from 'repositories/interns';
import { statusTypes } from 'models/Intern';

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
  return results
  .then(reply)
  .catch(reply);
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

export function getByUserHandler(request: *, reply: *) {
  const { userId } = request.params;
  return repo.retrieveAll({
    userId,
  })
  .then(reply)
  .catch(reply);
}

const getByUser = {
  method: 'GET',
  path: '/by_user/{userId}',
  handler: getByUserHandler,
  config: {
    auth: false,
    validate: {
      params: {
        userId: joi.string().required(),
      },
    },
  },
};

export function getByInternshipHandler(request: *, reply: *) {
  const { internshipId } = request.params;
  const { status } = request.payload;
  return repo.retrieveAll({
    internshipId,
    status,
  })
  .then(reply)
  .catch(reply);
}

const getByInternship = {
  method: 'POST',
  path: '/by_internship/{internshipId}',
  handler: getByInternshipHandler,
  config: {
    auth: false,
    validate: {
      params: {
        internshipId: joi.string().required(),
      },
      payload: {
        status: joi.array().items(joi.number().optional()).optional(),
      },
    },
  },
};

export function statusHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  const { status } = request.payload;
  return repo.getInternshipFromIntern(id)
  .then((internship) => {
    if (internship.userId !== userId) {
      throw boom.unauthorized('You do not have permission to change the status of this intern');
    }
    return repo.update({
      id,
    },
      {
        status,
      },
    );
  })
  .then(reply)
  .catch(reply);
}

export const status = {
  method: 'PATCH',
  path: '/{id}/status',
  handler: statusHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
      payload: {
        status: joi.number().required(),
      },
    },
  },
};

export function logMinutesHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  const { minutes } = request.payload;
  return repo.retrieveOne({
    id,
    userId,
  }).then((intern) => {
    const totalMinutes = intern.minutes + minutes;
    return repo.update({
      id,
      userId,
    },
      {
        minutes: totalMinutes,
        status: totalMinutes > 2400 ? statusTypes.AWAITING_APPROVAL : intern.status,
      });
  })
  .then(reply)
  .catch(reply);
}

export const logMinutes = {
  method: 'PATCH',
  path: '/{id}/minutes',
  handler: logMinutesHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
      payload: {
        minutes: joi.number().required(),
      },
    },
  },
};

export default controller('interns', [
  status,
  logMinutes,
  getByUser,
  getByInternship,
]);
