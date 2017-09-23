// @flow
import { RPC, types } from 'hapi-utils/rpc';

const rpc = new RPC();

export const createUser = (user: Object, activationLink: string) => {
  return rpc.createClient(types.CREATE_USER, { user, activationLink });
};

export const getLoginToken = (email: string, loginToken: string) => {
  return rpc.createClient(types.GET_LOGIN_TOKEN, { email, loginToken });
};
