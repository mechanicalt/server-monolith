// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import * as services from 'services/techs';
import repo from 'repositories/techs';

export function createHandler(request: *, reply: *) {
  const { name } = request.payload;
  return repo.insert({
    name,
  })
  .then(reply)
  .catch(reply);
}

export const create = {
  method: 'POST',
  path: '',
  handler: createHandler,
  config: {
    validate: {
      payload: {
        name: joi.string().required(),
      },
    },
  },
};

export default controller('techs', [
  create,
]);
