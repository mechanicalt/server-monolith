// @flow
import boom from 'boom';
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import { createTransaction } from 'hapi-utils/repos';
import applicationsRepo from 'repositories/applications';
import repo from 'repositories/offers';
import { statusTypes } from 'models/Application';

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { applicationId, message } = request.payload;
  return createTransaction((t) => {
    return applicationsRepo.getInternshipUserIdFromApplication(applicationId, t)
    .then((internshipUserId) => {
      if (internshipUserId !== userId) {
        throw boom.unauthorized('You do not have permission to send offer');
      }
      return Promise.all([
        repo.insert({
          applicationId,
          message,
        },
        undefined,
        t),
        applicationsRepo.update({
          id: applicationId,
        },
          {
            status: statusTypes.OFFERED,
          },
        t),
      ]).then(([id]) => id);
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
        applicationId: joi.string().required(),
        message: joi.string().required(),
      },
    },
  },
};

export const byApplicationHandler = (request: *, reply: *) => {
  const { id: userId } = getUser(request);
  const { applicationId } = request.params;
  return applicationsRepo.retrieveOne({
    id: applicationId,
    userId,
  }).then(() => {
    return repo.retrieveOne({
      applicationId,
    });
  })
  .then(reply)
  .catch(reply);
};

const byApplication = {
  method: 'GET',
  path: '/by_application/{applicationId}',
  handler: byApplicationHandler,
  config: {
    validate: {
      params: {
        applicationId: joi.string().required(),
      },
    },
  },
};

export const acceptHandler = (request: *, reply: *) => {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  return repo.getApplicationFromOffer(id)
  .then((application) => {
    if (userId !== application.userId) {
      throw boom.unauthorized('You do not have permission to accept this offer');
    }
    return applicationsRepo.update({
      id: application.id,
    }, {
      status: statusTypes.OFFER_ACCEPTED,
    });
  })
  .then(reply)
  .catch(reply);
};

const accept = {
  method: 'PATCH',
  path: '/{id}/accept',
  handler: acceptHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export const rejectHandler = (request: *, reply: *) => {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  return repo.getApplicationFromOffer(id)
  .then((application) => {
    if (userId !== application.userId) {
      throw boom.unauthorized('You do not have permission to reject this offer');
    }
    return applicationsRepo.update({
      id: application.id,
    }, {
      status: statusTypes.OFFER_REJECTED,
    });
  })
  .then(reply)
  .catch(reply);
};

const reject = {
  method: 'PATCH',
  path: '/{id}/reject',
  handler: rejectHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
    },
  },
};


export default controller('offers', [
  create,
  byApplication,
  accept,
  reject,
]);
