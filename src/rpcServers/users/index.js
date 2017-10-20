// @flow
import { types } from 'hapi-utils/rpc';
import repo from 'repositories/users';

export const getUsers = ({ ids }: Object) => {
  return repo.retrieveAll({
    id: ids,
  }, {
    transform: (users) => users.map(({ email, id, username }) => ({ id, email, username })),
  });
};


export default {
  [types.GET_USERS]: [getUsers],
};
