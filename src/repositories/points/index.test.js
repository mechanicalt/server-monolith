// @flow

import { truncate } from 'hapi-utils/tests';
import repo from './';

const getId = () => Math.floor(Math.random() * 1000000);

describe('points', () => {
  it('getTotalPointsPerInternship', () => {
    const internshipId = getId();

    return Promise.all([
      repo.insert({
        internshipId,
        points: 10,
      }),
    ]).then(() =>
      repo
        .getTotalPointsPerInternship([internshipId])
        .then(internships => expect(internships[0].points).toEqual(10))
    );
  });
  afterEach(() => Promise.all([truncate('points')]));
});
