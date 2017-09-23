// @flow
import startRPC from 'hapi-utils/rpc';
import users from './users';

startRPC().then(RPC => RPC.processServers(users));
