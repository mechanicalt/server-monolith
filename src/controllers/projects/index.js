// @flow
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

export default controller('projects', [
  create,
]);
