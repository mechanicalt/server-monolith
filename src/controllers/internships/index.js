// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import * as services from 'services/internships';
import * as projectServices from 'services/projects';
import repo from 'repositories/internships';

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { projectId } = request.payload;
  return projectServices.doesUserOwnProject(userId, projectId)
  .then(() => {
    return repo.insert({
      projectId,
    });
  })
  .then(reply)
  .catch(reply);
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
};

export function getByProjectHandler(request: *, reply: *) {
  const { id } = request.params;
  return repo.retrieveAll({
    projectId: id,
  })
  .then(reply)
  .catch(reply);
}

export const getByProject = {
  method: 'GET',
  path: '/by_project/{id}',
  handler: getByProjectHandler,
  config: {
    auth: false,
    validate: {
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

export default controller('internships', [
  create,
  getByProject,
  get,
]);
