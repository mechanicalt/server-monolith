// @flow
import { RPC, types } from 'hapi-utils/rpc';

const rpc = new RPC();

export const createUser = (user: Object, activationLink: string) =>
  rpc.createClient(types.CREATE_USER, { user, activationLink });

export const getLoginToken = (email: string, loginToken: string) =>
  rpc.createClient(types.GET_LOGIN_TOKEN, { email, loginToken });
