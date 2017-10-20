// @flow
import { RPC, types } from 'hapi-utils/rpc';

const rpc = new RPC();

export const getUsers = (ids: Array<$$id>) => {
  return rpc.createClient(types.GET_USERS, { ids });
};
