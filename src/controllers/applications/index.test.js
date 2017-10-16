// @flow
import { truncate, decorateRequestWithUser, mockReply, getId } from 'hapi-utils/tests';
import projectsRepo from 'repositories/projects';
import internshipsRepo from 'repositories/internships';
import repo from 'repositories/applications';
import { statusTypes } from 'models/Internship';
import { createHandler } from './';

describe('internships', () => {
  it('getInternshipUserId', () => {
    const internshipId = getId();
    const projectId = getId();
    const userId = getId();
    const otherUserId = getId();
    const payload = {
      internshipId,
    };
    const request = decorateRequestWithUser({
      payload,
    }, { id: userId });
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
    ]).then(() => {
      return createHandler(request, mockReply)
      .then((id) => {
        return repo.retrieveOne({
          id,
        }).then((application) => {
          return expect(application.internshipId).toBe(internshipId);
        });
      });
    });
  });
  afterEach(()=>{
    return Promise.all([
      truncate('projects'),
      truncate('internships'),
      truncate('applications'),
    ]);
  });
});
