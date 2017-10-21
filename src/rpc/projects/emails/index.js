// @flow
import { RPC, types } from 'hapi-utils/rpc';

const rpc = new RPC();

export const sendEmail = (type: string, emailProps: Object, payload: Object) => rpc.createClient(types.SEND_EMAIL, { type, emailProps, payload });
