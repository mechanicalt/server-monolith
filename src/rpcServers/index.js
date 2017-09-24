// @flow
import startRPC from 'hapi-utils/rpc';
import users from './emails/users';

startRPC().then(RPC => RPC.processServers(users));
