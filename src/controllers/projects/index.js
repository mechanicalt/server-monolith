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
  const { name, description } = request.payload;
  return repo.update(
    {
      id,
      userId,
    },
    {
      name,
      description,
    })
  .then(reply)
  .catch(reply);
}

export const edit = {
  method: 'POST',
  path: '/{id}',
  handler: editHandler,
  config: {
    validate: {
      payload: {
        name: joi.string().required(),
        description: joi.string().required(),
      },
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export default controller('projects', [
  create,
  edit,
]);
