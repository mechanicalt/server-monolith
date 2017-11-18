// @flow
import crypto from 'crypto';
import oauthRepo from 'repositories/oauth';
import usersRepo from 'repositories/users';
import * as sessionServices from 'services/sessions';
import { types as oauthTypes } from 'utils/oauth';

const { CLIENT_URL } = process.env;

const getRedirectWithTokenUrl = (jwt: string) =>
  `${CLIENT_URL || ''}?auth=${jwt}`;

const oauthSessionStart = (id, username) =>
  sessionServices
    .create({ id, username })
    .then(jwt => getRedirectWithTokenUrl(jwt));

export function linkedInOAuth(
  id: $$id,
  { username, email, imageUrl, linkedInUrl }: Object
) {
  return oauthRepo.findUser(id, oauthTypes.LINKEDIN).then(oauth => {
    // No Account
    if (!oauth) {
      const emailToken = crypto.randomBytes(20).toString('hex');
      return usersRepo
        .insert({ emailToken, email, imageUrl, username, linkedInUrl })
        .then(userId =>
          oauthRepo
            .insert({ userId, oauthId: id, type: oauthTypes.LINKEDIN })
            .then(() => oauthSessionStart(userId, username))
        );
    }
    // Login
    return oauthSessionStart(oauth.id, oauth.username);
  });
}
