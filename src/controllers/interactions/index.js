// @flow

import joi from 'joi';
import { parse } from 'qs';
import controller from 'hapi-utils/controllers';
import { getUser } from 'hapi-utils/request';

import repo from 'repositories/interactions';

export function createHandler(request: *, reply: *) {
  const { meta } = request.payload;
  const { headers: { referer: fullPath } } = request;
  const { remoteAddress } = request.info;
  const forwardAddress = request.headers['x-real-ip'];
  const [path, rawQuery = null] = fullPath.split('?');
  const query = JSON.stringify(rawQuery ? parse(rawQuery) : {});
  const userId = getUser(request, 'id');
  repo.insert({
    userId,
    ipAddress: forwardAddress || remoteAddress,
    path,
    query,
    meta,
  });
  reply();
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
  config: {
    auth: {
      mode: 'optional',
    },
    validate: {
      payload: {
        meta: joi.string().required(),
      },
    },
  },
};

export default controller('interactions', [create]);
