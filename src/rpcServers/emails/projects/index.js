// @flow
import { types } from 'hapi-utils/rpc';
import sendNotifications, { Email } from 'utils/email';

export const sendProjectEmail = ({ type, emailProps, payload }: Object) => {
  return sendNotifications([
    new Email(type, emailProps, payload),
  ]);
};

export default {
  [types.SEND_EMAIL]: [sendProjectEmail],
};
