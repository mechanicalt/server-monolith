// @flow
import joi from 'joi';
import boom from 'boom';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import * as services from 'services/projects';
import repo from 'repositories/projects';
import internshipRepo from 'repositories/internships';
import { indexEndpoint } from 'utils/controller';

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

export function byUserHandler(request: *, reply: *) {
  const { id } = request.params;
  return repo.retrieveAll({
    userId: id,
  })
  .then(reply)
  .catch(reply);
}

export const byUser = {
  method: 'GET',
  path: '/by_user/{id}',
  handler: byUserHandler,
  config: {
    auth: false,
    validate: {
      params: {
        id: joi.string().required(),
      },
    },
  },
};

export function searchHandler(request: *, reply: *) {
  return repo.search(request.payload.searchText)
  .then(reply)
  .catch(reply);
}

const search = {
  method: 'POST',
  path: '/search',
  handler: searchHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        searchText: joi.string().required(),
      },
    },
  },
};

export const delHandler = (request: *, reply: *) => {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  return internshipRepo.retrieveAll({
    projectId: id,
  }).then((internships) => {
    if (internships.length) {
      throw boom.badRequest(`You need to delete all of this project's internships before deleting the project`)
    }
    return repo.remove({
      id,
      userId,
    });
  })
  .then(reply)
  .catch(reply);
};

const del = {
  method: 'DELETE',
  path: '/{id}',
  handler: delHandler,
  config: {
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
  byUser,
  search,
  del,
  indexEndpoint(repo),
]);
