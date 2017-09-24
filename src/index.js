// @flow
import getRegister from 'hapi-utils/server';
import { getPlugin } from 'hapi-utils/rpc';
import users from 'controllers/users';
import sessions from 'controllers/sessions';
import userPlugin from 'app/users';
import 'rpcServers';

module.exports = getRegister([...users, ...sessions], [getPlugin(process.env.RPC_CONNECTION), userPlugin]);
