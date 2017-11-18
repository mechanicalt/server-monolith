// @flow
import {
  truncate,
  decorateRequestWithUser,
  mockReply,
  getId,
} from 'hapi-utils/tests';
import projectsRepo from 'repositories/projects';
import internshipsRepo from 'repositories/internships';
import repo from 'repositories/applications';
import { statusTypes } from 'models/Internship';
import { createHandler } from './';

describe('applications', () => {
  it('create', () => {
    const internshipId = getId();
    const projectId = getId();
    const userId = getId();
    const otherUserId = getId();
    const payload = {
      internshipId,
    };
    const request = decorateRequestWithUser(
      {
        payload,
      },
      { id: userId }
    );
    return Promise.all([
      internshipsRepo.insert({
        id: internshipId,
        projectId,
        status: statusTypes.ACTIVE,
      }),
      projectsRepo.insert({
        id: projectId,
        userId: otherUserId,
      }),
    ]).then(() =>
      createHandler(request, mockReply).then(id =>
        repo
          .retrieveOne({
            id,
          })
          .then(application =>
            expect(application.internshipId).toBe(internshipId)
          )
      )
    );
  });
  afterEach(() =>
    Promise.all([
      truncate('projects'),
      truncate('internships'),
      truncate('applications'),
    ])
  );
});
