// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import { loginWithToken } from '../services/users';
import { getTokenFromHeaders, getUserFromAuth } from '../utils';

export function createHandler(request: Object, reply: Function) {
  const { email, loginToken } = request.payload;
  return loginWithToken({ email, loginToken })
  .then(({ token, user }) => {
    reply({ token, user });
  }).catch(reply);
}

const create = {
  method: 'POST',
  path: '',
  config: {
    validate: {
      payload: {
        email: joi.string().email().required(),
        loginToken: joi.string().required(),
      },
    },
    auth: false,
  },
  handler: createHandler,
};

export function getHandler(req: Object, reply: Function) {
  const token = getTokenFromHeaders(req);
  const user = getUserFromAuth(req);
  return reply({ token, user });
}

const index = {
  method: 'GET',
  path: '',
  handler: getHandler,
};

export default controller('sessions', [create, index]);
