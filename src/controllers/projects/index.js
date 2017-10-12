// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import * as services from 'services/projects';
import repo from 'repositories/projects';

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  return repo.insert({
    userId,
  })
  .then(reply)
  .catch(reply);
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
};

export function editHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  return repo.update(
    {
      id,
      userId,
    },
    request.payload)
  .then(reply)
  .catch(reply);
}

export const edit = {
  method: 'PATCH',
  path: '/{id}',
  handler: editHandler,
  config: {
    validate: {
      payload: {
        name: joi.string().optional(),
        description: joi.string().optional(),
      },
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export function getHandler(request: *, reply: *) {
  const { id } = request.params;
  return repo.retrieve({
    id,
  })
  .then(reply)
  .catch(reply);
}

export const get = {
  method: 'GET',
  path: '/{id}',
  handler: getHandler,
  config: {
    auth: false,
    validate: {
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export default controller('projects', [
  create,
  edit,
  get,
]);
