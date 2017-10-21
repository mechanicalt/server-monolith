// @flow
import { truncate, decorateRequestWithUser, getId } from 'hapi-utils/tests';
import projectsRepo from 'repositories/projects';
import internshipsRepo from 'repositories/internships';
import applicationsRepo from 'repositories/applications';
import repo from 'repositories/offers';
import internsRepo from 'repositories/interns';
import usersRepo from 'repositories/users';
import { statusTypes } from 'models/Internship';
import { statusTypes as applicationStatusTypes } from 'models/Application';
import { statusTypes as internStatusTypes } from 'models/Intern';
import { createHandler, acceptHandler } from './';

const mockReply = resp => resp;

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
      usersRepo.insert({
        id: otherUserId,
        email: 'email@email.com',
        username: 'username',
      }),
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
    ]).then(() => createHandler(request, mockReply)
      .then(id => repo.retrieveOne({ id }).then(offer => expect(offer.applicationId).toBe(applicationId))).then(() => applicationsRepo.retrieveOne({ id: applicationId })
        .then(application => expect(application.status).toBe(applicationStatusTypes.OFFERED))));
  });
  it('accepts', () => {
    const applicationId = getId();
    const internshipId = getId();
    const projectId = getId();
    const userId = getId();
    const otherUserId = getId();
    const offerId = getId();
    const params = {
      id: offerId,
    };
    const request = decorateRequestWithUser({
      params,
    }, { id: userId });
    return Promise.all([
      usersRepo.insert({
        id: userId,
        email: 'email@email.com',
        username: 'username',
      }),
      applicationsRepo.insert({
        id: applicationId,
        status: applicationStatusTypes.OFFERED,
        internshipId,
        userId,
      }),
      internshipsRepo.insert({
        id: internshipId,
        projectId,
        status: statusTypes.ACTIVE,
      }),
      projectsRepo.insert({
        id: projectId,
        userId: otherUserId,
      }),
      repo.insert({
        id: offerId,
        applicationId,
      }),
    ])
    .then(() => acceptHandler(request, mockReply)
      .then(() => applicationsRepo.retrieveOne({ id: applicationId }).then(application => expect(application.status).toBe(applicationStatusTypes.OFFER_ACCEPTED)))
      .then(() => internsRepo.retrieveOne({ userId, internshipId })
        .then(intern => expect(intern.status).toBe(internStatusTypes.ACTIVE))));
  });
  afterEach(() => Promise.all([
    truncate('users'),
    truncate('projects'),
    truncate('internships'),
    truncate('applications'),
    truncate('offers'),
    truncate('interns'),
  ]));
});
