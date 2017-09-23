// @flow
import hapiAuthGoogle from 'hapi-auth-google';
import googleAuthHandler from './googleOAuthHandler';

const { API_PREFIX = '' } = process.env;

const opts = {
  REDIRECT_URL: `${API_PREFIX || ''}/googleauth`, // must match google app redirect URI from step 2.8
  handler: googleAuthHandler, // your handler
  config: {  // optional route config (as for any route in hapi)
    description: 'Google auth callback',
    notes: 'Handled by hapi-auth-google plugin',
    tags: ['api', 'auth', 'plugin'],
  },
  access_type: 'online', // options: offline, online
  approval_prompt: 'auto', // options: always, auto
  scope: 'https://www.googleapis.com/auth/plus.profile.emails.read', // ask for their email address
};

function register(app: Object, options: Object, pluginNext: Function) {
  app.register([
    { register: hapiAuthGoogle, options: opts },
  ]);
  app.decorate('request', 'generate_google_oauth2_url', app.generate_google_oauth2_url);
  pluginNext();
}
register.attributes = {
  name: 'users',
  version: '1.0.0',
};

module.exports = register;
