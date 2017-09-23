// @flow
import jwt from 'jsonwebtoken';
import { promisify } from 'bluebird';

const { JWT_SECRET } = process.env;

const sign = promisify(jwt.sign);
export function create({ id, username }: Object) {
  return sign({ id, username }, JWT_SECRET, {
    expiresIn: '2000h',
  });
}
