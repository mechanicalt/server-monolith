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


export default controller('offers', [
  create,
]);
