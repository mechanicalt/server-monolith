// @flow

import { truncate } from 'hapi-utils/tests';
import projectsRepo from 'repositories/projects';
import repo from './';

const getId = () => Math.floor(Math.random() * 1000000);

describe('internships', () => {
  it('getInternshipWithUserId', () => {
    const internshipId = getId();
    const projectId = getId();
    const userId = getId();

    return Promise.all([
      repo.insert({
        id: internshipId,
        projectId,
      }),
      projectsRepo.insert({
        id: projectId,
        userId,
      }),
    ]).then(() =>
      repo
        .getInternshipWithUserId(internshipId)
        .then(internship => expect(internship.userId).toEqual(userId))
    );
  });
  afterEach(() => Promise.all([truncate('projects'), truncate('internships')]));
});
