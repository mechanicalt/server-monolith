// @flow
import crypto from 'crypto';
import controller from 'hapi-utils/controllers';
import flash from 'hapi-utils/flash';
import joi from 'joi';
import * as rpc from 'rpc/users/emails';
import * as services from '../services/users';
import * as sessionServices from '../services/sessions';

export function createHandler(request: *, reply: *) {
  const { email, username } = request.payload;
  return Promise.all([
    services.doesEmailAlreadyExist(email),
    services.doesUsernameAlreadyExist(username),
  ])
  .then(() => {
    const emailToken = crypto.randomBytes(20).toString('hex');
    const loginToken = crypto.randomBytes(20).toString('hex');
    return Promise.all([services.create({ username, email, loginToken, emailToken }), emailToken]);
  })
  .then(([id, emailToken]) => {
    rpc.createUser({
      username,
      email,
    }, `${process.env.BASE_URL}/${id}/confirm_email/${emailToken}`);
    return sessionServices.create({ username, email, id })
    .then((token) => {
      reply({
        user: { id },
        session: token,
      });
    });
  })
  .catch(reply);
}

const joiUsername = joi.string().regex(/^[a-z0-9 -]*$/i).required();

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        username: joiUsername,
        email: joi.string().email().required(),
      },
    },
  },
};

export const getUsersHandler = (request: *, reply: *) => {
  return services.getUsers(request.payload.userIds).then(reply).catch(reply);
};

export const getUsers = {
  method: 'POST',
  path: '/get_users',
  handler: getUsersHandler,
  config: {
    auth: {
      strategy: 'jwt',
      mode: 'try',
    },
    validate: {
      payload: {
        userIds: joi.array().items(joi.number().required()).required(),
      },
    },
  },
};

export const getHandler = (request: *, reply: *) => {
  return services.get(request.params.id).then(reply).catch(reply);
};

export const get = {
  method: 'GET',
  path: '/{id}',
  handler: getHandler,
  config: {
    auth: {
      mode: 'try',
    },
    validate: {
      params: {
        id: joi.number().required(),
      },
    },
  },
};

export function checkUsernameHandler(request: *, reply: *) {
  const { username } = request.payload;
  return services.doesUsernameAlreadyExist(username).then(() => reply(false))
  .catch(() => reply(true));
}

export const checkUsername = {
  method: 'POST',
  path: '/check_username',
  handler: checkUsernameHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        username: joiUsername,
      },
    },
  },
};

export function checkEmailHandler(request: *, reply: *) {
  const { email } = request.payload;
  return services.doesEmailAlreadyExist(email).then(() => reply(false))
  .catch(() => reply(true));
}

export const checkEmail = {
  method: 'POST',
  path: '/check_email',
  handler: checkEmailHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        email: joi.string().email().required(),
      },
    },
  },
};

export function confirmEmailHandler(request: *, reply: *) {
  const { id, token } = request.params;
  return services.confirmEmail(id, token)
  .then(() => reply().redirect(flash('confirmEmail')))
  .catch(() => reply().redirect(flash('confirmEmail', true)));
}

export const confirmEmail = {
  method: 'GET',
  path: '/{id}/confirm_email/{token}',
  handler: confirmEmailHandler,
  config: {
    auth: false,
    validate: {
      params: {
        id: joi.string().required(),
        token: joi.string().required(),
      },
    },
  },
};

export function loginTokenHandler(request: *, reply: *) {
  const { email } = request.params;
  return services.getLoginToken(email)
  .then(reply)
  .catch(reply);
}

export const loginToken = {
  method: 'GET',
  path: '/login_token/{email}',
  handler: loginTokenHandler,
  config: {
    auth: false,
    validate: {
      params: {
        email: joi.string().required(),
      },
    },
  },
};

export function createUsernameHandler(request: *, reply: *) {
  const { id, token } = request.params;
  const { username } = request.payload;
  return services.doesUsernameAlreadyExist(username)
  .then(() => {
    return services.createUsername(id, token, username)
    .then(() => sessionServices.create({ username, id })
      .then((jwtoken) => {
        reply(jwtoken);
      }),
    );
  }).catch(reply);
}

export const createUsername = {
  method: 'POST',
  path: '/{id}/create_username/{token}',
  handler: createUsernameHandler,
  config: {
    auth: false,
    validate: {
      params: {
        id: joi.string().required(),
        token: joi.string().required(),
      },
      payload: {
        username: joi.string().required(),
      },
    },
  },
};


export default controller('users', [
  create,
  getUsers,
  get,
  checkEmail,
  checkUsername,
  confirmEmail,
  createUsername,
  loginToken,
]);
