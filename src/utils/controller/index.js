// @flow
import joi from 'joi';
import Repo from 'hapi-utils/repos';

export function indexEndpoint(repo: Repo<*>) {
  function indexHandler(request: *, reply: *) {
    const { ids } = request.payload;
    return repo
      .retrieveAll({
        id: ids,
      })
      .then(reply)
      .catch(reply);
  }
  return {
    method: 'POST',
    path: '/index',
    handler: indexHandler,
    config: {
      auth: false,
      validate: {
        payload: {
          ids: joi
            .array()
            .items(joi.number().required())
            .required(),
        },
      },
    },
  };
}
