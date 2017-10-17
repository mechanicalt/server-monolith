// @flow
import { truncate, decorateRequestWithUser, getId } from 'hapi-utils/tests';
import projectsRepo from 'repositories/projects';
import internshipsRepo from 'repositories/internships';
import applicationsRepo from 'repositories/applications';
import repo from 'repositories/offers';
import { statusTypes } from 'models/Internship';
import { statusTypes as applicationStatusTypes } from 'models/Application';
import { createHandler } from './';

const mockReply = (resp) => {
  console.log(resp);
  return resp;
};

describe('offers', () => {
  it('create', () => {
    const applicationId = getId();
    const internshipId = getId();
    const projectId = getId();
    const userId = getId();
    const otherUserId = getId();
    const payload = {
      applicationId,
    };
    const request = decorateRequestWithUser({
      payload,
    }, { id: userId });
    return Promise.all([
      applicationsRepo.insert({
        id: applicationId,
        status: applicationStatusTypes.PENDING,
        internshipId,
        userId: otherUserId,
      }),
      internshipsRepo.insert({
        id: internshipId,
        projectId,
        status: statusTypes.ACTIVE,
      }),
      projectsRepo.insert({
        id: projectId,
        userId,
      }),
    ]).then(() => {
      return createHandler(request, mockReply)
      .then(() => {
        return repo.retrieveOne({}).then((offer) => {
          return expect(offer.applicationId).toBe(applicationId);
        });
      }).then(() => {
        return applicationsRepo.retrieveOne({ id: applicationId })
        .then((application) => {
          return expect(application.status).toBe(applicationStatusTypes.OFFERED);
        });
      });
    });
  });
  afterEach(() => {
    return Promise.all([
      truncate('projects'),
      truncate('internships'),
      truncate('applications'),
      truncate('offers'),
    ]);
  });
});
