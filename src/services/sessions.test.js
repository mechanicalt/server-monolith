// @flow
import { promisify } from 'bluebird';
import jwt from 'jsonwebtoken';
import { create } from './sessions';

const verify = promisify(jwt.verify);

describe('services.sessions', () => {
  it('creates', () => {
    const user = {
      id: 1,
      username: 'ExampleUser',
    };
    return create(user).then((token)=>{
      return verify(token, process.env.JWT_SECRET);
    }).then((decoded)=>{
      expect(decoded.id).toEqual(user.id);
      return expect(decoded.username).toEqual(user.username);
    })
  });
});