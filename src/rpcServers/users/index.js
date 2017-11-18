// @flow
import { types } from 'hapi-utils/rpc';
import repo from 'repositories/users';

export const getUsers = ({ ids }: Object) =>
  repo
    .retrieveAll(
      {
        id: ids,
      },
      {
        transform: users =>
          users.map(({ email, id, username }) => ({ id, email, username })),
      }
    )
    .then(users => {
      const usersMap = users.reduce((finalResult, user) => {
        finalResult[user.id] = user;
        return finalResult;
      }, {});
      const result = ids.map(id => usersMap[id]);
      return result;
    });

export default {
  [types.GET_USERS]: [getUsers],
};
