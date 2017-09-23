// @flow
import validate from 'validate.js';
import { promisify } from 'bluebird';
import bcrypt from 'bcryptjs';

const hash = promisify(bcrypt.hash);

const emailAndPasswordConstraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
    },
  },
};

export function isEmailAndPasswordValid(params: {email: string; password: string}): void | Object {
  return validate(params, emailAndPasswordConstraints);
}

export function getTokenFromHeaders(req: Object) {
  return req.headers.authorization;
}

export function generateDigest(password: string) {
  return hash(password, 10);
}

export function getUserFromAuth(req: Object) {
  return req.auth.credentials;
}