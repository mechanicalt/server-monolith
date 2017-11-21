// @flow

import { truncate } from 'hapi-utils/tests';
import { squel } from 'hapi-utils/repos';
import projectsRepo from 'repositories/projects';
import { statusTypes } from 'models/Internship';
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
  it('getExpiredPostedAt', () => {
    const internshipId = getId();
    return Promise.all([
      repo.insert({
        id: internshipId,
        postedAt: squel.str("(NOW() - interval '20 days')"),
        status: statusTypes.ACTIVE,
      }),
      repo.insert({
        postedAt: squel.str("(NOW() - interval '9 days')"),
        status: statusTypes.ACTIVE,
      }),
      repo.insert({
        postedAt: squel.str("(NOW() - interval '20 days')"),
        status: statusTypes.INACTIVE,
      }),
    ]).then(() => {
      return repo.getExpiredPostedAt().then(internships => {
        return expect(internships.length).toBe(1);
      });
    });
  });
  afterEach(() => Promise.all([truncate('projects'), truncate('internships')]));
});
