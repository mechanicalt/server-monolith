// @flow
import { types } from 'hapi-utils/rpc';
import sendNotifications, { Email } from 'utils/email';

export const createUser = ({ user, activationLink }: Object) => {
  const email = new Email(
    'createUser',
    { to: user.email },
    { username: user.username, activationLink }
  );
  return sendNotifications([email]).then(() => 'success');
};

export const getLoginToken = ({ email, loginToken }: Object) =>
  sendNotifications([
    new Email('getLoginToken', { to: email }, { loginToken }),
  ]).then(() => 'success');

export default {
  [types.CREATE_USER]: [createUser],
  [types.GET_LOGIN_TOKEN]: [getLoginToken],
};
