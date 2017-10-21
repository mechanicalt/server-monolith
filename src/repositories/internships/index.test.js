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
    ]).then(() => {
      return repo.getInternshipWithUserId(internshipId)
      .then((internship) => {
        return expect(internship.userId).toEqual(userId);
      });
    });
  });
  afterEach(()=>{
    return Promise.all([
      truncate('projects'),
      truncate('internships'),
    ]);
  });
});
