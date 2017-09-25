// @flow
import boom from 'boom';
import User from 'models/User';
import repo from 'repositories/users';
import * as rpc from 'rpc/users/emails';
import { create as createSession } from './sessions';

export function doesEmailAlreadyExist(email: string) {
  return repo.findEmail(email).then((results) => {
    if (results) {
      throw boom.badRequest('Email already exists');
    }
  });
}

export function doesUsernameAlreadyExist(username: string) {
  return repo.retrieve({ username }).then((results) => {
    if (results) {
      throw boom.badRequest('Username already exists');
    }
  });
}

export function create(params: Object) {
  return repo.insert(params);
}

export function loginWithToken({ email, loginToken }: Object) {
  return repo.retrieve({ email }).then(((user) => {
    if (user) {
      if (user.loginToken === loginToken) {
        return createSession(user)
        .then(token => ({ token, user: { id: user.id, email: user.email } }),
        );
      }
      throw boom.badRequest('Wrong email password combination');
    }
    throw boom.badRequest('There is no account associated with that email address');
  }));
}

export function getLoginToken(email: string) {
  return repo.retrieve({ email })
  .then((user) => {
    if (!user) {
      throw boom.badRequest();
    }
    return rpc.getLoginToken(email, user.loginToken);
  });
}

export function get(id: number) {
  return repo.retrieveOne({ id }).then(user => new User(user));
}

export function getUsers(ids: number[]) {
  return repo.retrieveAll({ id: ids })
  .then(users => users.map(user => new User(user)));
}

export function confirmEmail(id: $$id, token: string) {
  return repo.retrieveOne({ id })
  .then((user) => {
    if (user.emailToken === token) {
      return repo.update({ id }, { confirmedEmail: new Date().toDateString() });
    }
    throw boom.badRequest();
  });
}

export function createUsername(id: $$id, emailToken: string, username: string) {
  return repo.retrieveOne({ id, emailToken })
  .then(() => {
    return repo.update({ id }, { username, confirmedEmail: new Date().toDateString() });
  });
}
