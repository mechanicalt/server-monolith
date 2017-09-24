// @flow
import crypto from 'crypto';
import oauthRepo from 'repositories/oauth';
import usersRepo from 'repositories/users';
import * as sessionServices from 'services/sessions';

const oauthTypes = {
  google: 1,
};

const { CLIENT_URL } = process.env;

const getCreateUsernameUrl = (userId, token) => `${CLIENT_URL || ''}?create_username=true&id=${userId}&token=${token}`;

export default function googleOAuthHandler(req: Object, reply: Function, tokens: string[], profile: Object) {
  if (profile) {
    // extract the relevant data from Profile to store in JWT object
    return oauthRepo.findUser(profile.id, oauthTypes.google)
    .then((oauth) => {
      // No Account
      if (!oauth) {
        const emailToken = crypto.randomBytes(20).toString('hex');
        return usersRepo.insert({ emailToken, email: profile.emails[0].value })
        .then(({ id: userId }) => {
          return oauthRepo.insert({ userId, oauthId: profile.id, type: oauthTypes.google })
          .then(() => {
            return reply.redirect(getCreateUsernameUrl(userId, emailToken));
          });
        });
      }
      // No Activated Account
      if (!oauth.confirmedEmail) {
        return reply.redirect(getCreateUsernameUrl(oauth.id, oauth.emailToken));
      }
      // Login
      return sessionServices.create({ id: oauth.id, username: oauth.username })
      .then((jwt) => {
        return reply.redirect(`${CLIENT_URL || ''}?auth=${jwt}`);
      });
    });
  }
  return reply('Sorry, something went wrong, please try again.');
}
