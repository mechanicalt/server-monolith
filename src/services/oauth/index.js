import crypto from 'crypto';
import oauthRepo from 'repositories/oauth';
import usersRepo from 'repositories/users';
import * as sessionServices from 'services/sessions';
import { types as oauthTypes } from 'utils/oauth';

const { CLIENT_URL } = process.env;

const getRedirectWithTokenUrl = (jwt: string) => `${CLIENT_URL || ''}?auth=${jwt}`;

const oauthSessionStart = (id, username) => {
  return sessionServices.create({ id, username })
  .then((jwt) => {
    return getRedirectWithTokenUrl(jwt);
  });
};

export function linkedInOAuth(id, { username, email, imageUrl }) {
  return oauthRepo.findUser(id, oauthTypes.LINKEDIN)
  .then((oauth) => {
    // No Account
    if (!oauth) {
      const emailToken = crypto.randomBytes(20).toString('hex');
      return usersRepo.insert({ emailToken, email, imageUrl, username })
      .then((userId) => {
        return oauthRepo.insert({ userId, oauthId: id, type: oauthTypes.LINKEDIN })
        .then(() => {
          return oauthSessionStart(userId, username);
        });
      });
    }
    // Login
    return oauthSessionStart(oauth.id, oauth.username);
  });
}
