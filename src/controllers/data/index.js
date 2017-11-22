// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import repo from 'repositories/data';

export function createHandler(request: *, reply: *) {
  return repo
    .insert(request.payload)
    .then(reply)
    .catch(reply);
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        data: joi.string().required(),
      },
    },
  },
};

export function getHandler(request: *, reply: *) {
  return reply('Alive');
}

export const get = {
  method: 'GET',
  path: '',
  handler: getHandler,
  config: {
    auth: false,
  },
};

export default controller('data', [get, create]);
