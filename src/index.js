// @flow
import getRegister from 'hapi-utils/server';
import { getPlugin } from 'hapi-utils/rpc';
import users from 'controllers/users';
import sessions from 'controllers/sessions';
import oauth from 'controllers/oauth';
import projects from 'controllers/projects';
import internships from 'controllers/internships';
import techs from 'controllers/techs';
import applications from 'controllers/applications';
import offers from 'controllers/offers';
import interns from 'controllers/interns';
import points from 'controllers/points';
import interactions from 'controllers/interactions';
import userPlugin from 'app/users';
import internshipPlugin from 'app/internships';
import 'rpcServers';

module.exports = getRegister(
  [
    ...interactions,
    ...points,
    ...interns,
    ...applications,
    ...users,
    ...sessions,
    ...oauth,
    ...projects,
    ...internships,
    ...techs,
    ...offers,
  ],
  [getPlugin(process.env.RPC_CONNECTION), userPlugin, internshipPlugin]
);
