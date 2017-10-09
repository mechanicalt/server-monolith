// @flow
import getRegister from 'hapi-utils/server';
import { getPlugin } from 'hapi-utils/rpc';
import users from 'controllers/users';
import sessions from 'controllers/sessions';
import oauth from 'controllers/oauth';
import projects from 'controllers/projects';
import internships from 'controllers/internships';
import userPlugin from 'app/users';
import 'rpcServers';

module.exports = getRegister([
  ...users,
  ...sessions,
  ...oauth,
  ...projects,
  ...internships,
], [getPlugin(process.env.RPC_CONNECTION), userPlugin]);
