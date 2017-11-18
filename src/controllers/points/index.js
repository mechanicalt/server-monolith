// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import repo from 'repositories/points';

export function byInternshipsHandler(request: *, reply: *) {
  const { ids } = request.payload;
  return repo
    .getTotalPointsPerInternship(ids)
    .then(totalPoints =>
      totalPoints.map(p => ({ id: p.internshipId, points: p.points }))
    )
    .then(reply)
    .catch(reply);
}

export const byInternships = {
  method: 'POST',
  path: '/by_internships',
  handler: byInternshipsHandler,
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

export default controller('points', [byInternships]);
