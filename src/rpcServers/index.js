// @flow
import startRPC from 'hapi-utils/rpc';
import emails from './emails';
import users from './users';

startRPC().then(RPC => RPC.processServers({
  ...emails,
  ...users,
}));
