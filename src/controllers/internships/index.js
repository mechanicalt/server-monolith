// @flow
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';
import * as services from 'services/internships';
import repo from 'repositories/internships';

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

export default controller('internships', [
  create,
]);
