// @flow
import joi from 'joi';
import boom from 'boom';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import * as projectServices from 'services/projects';
import repo from 'repositories/internships';
import internsRepo from 'repositories/interns';
import { indexEndpoint } from 'utils/controller';
import { statusTypes } from 'models/Internship';

export function createHandler(request: *, reply: *) {
  const { id: userId } = getUser(request);
  const { projectId } = request.payload;
  return projectServices.doesUserOwnProject(userId, projectId)
  .then(() => repo.insert({
    projectId,
  }))
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
        projectId: joi.string().required(),
      },
    },
  },
};

export const updateHandler = (request: *, reply: Function) => {
  const user = getUser(request);
  const { id } = request.params;
  return repo.retrieveOne({ id })
  .then(internship => projectServices.doesUserOwnProject(user.id, internship.projectId))
  .then(() => repo.update({
    id,
  },
      request.payload,
    ))
  .then(reply)
  .catch(reply);
};

const update = {
  method: 'PATCH',
  path: '/{id}',
  handler: updateHandler,
  config: {
    validate: {
      params: {
        id: joi.string().required(),
      },
      payload: {
        name: joi.string().optional(),
        description: joi.string().optional(),
        status: joi.number().optional(),
      },
    },
  },
};


export function byUserHandler(request: *, reply: *) {
  const { id } = request.params;
  return repo.byUser(id)
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

export function getByProjectHandler(request: *, reply: *) {
  const { id } = request.params;
  const { status } = request.payload;
  return repo.retrieveAll({
    projectId: id,
    status,
  })
  .then(reply)
  .catch(reply);
}

export const getByProject = {
  method: 'POST',
  path: '/by_project/{id}',
  handler: getByProjectHandler,
  config: {
    auth: false,
    validate: {
      params: {
        id: joi.string().required(),
      },
      payload: {
        status: joi.array().items(joi.number().required()).required(),
      },
    },
  },
};

export function getHandler(request: *, reply: *) {
  const { id } = request.params;
  return repo.retrieveOne({ id })
  .then(reply)
  .catch(reply);
}

const get = {
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

export function searchHandler(request: *, reply: *) {
  const { searchText } = request.payload;
  return (searchText ? repo.search(searchText) : repo.retrieveAll({ status: statusTypes.ACTIVE }))
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
        searchText: joi.string().trim().allow('').required(),
      },
    },
  },
};

export const delHandler = (request: *, reply: *) => {
  const { id: userId } = getUser(request);
  const { id } = request.params;
  return repo.getInternshipWithUserId(id)
  .then((internship) => {
    if (userId !== internship.userId) {
      throw boom.unauthorized('You do not have permission to delete this internship');
    }
    return internsRepo.retrieveAll({
      internshipId: id,
    });
  })
  .then((interns) => {
    if (interns.length) {
      throw boom.badRequest('You cannot delete internships which have had atleast a single intern');
    }
    return repo.remove({
      id,
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

export default controller('internships', [
  create,
  byUser,
  get,
  update,
  getByProject,
  search,
  indexEndpoint(repo),
  del,
]);
