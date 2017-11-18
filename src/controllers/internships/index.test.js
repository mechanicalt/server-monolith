// @flow
import projectRepo from 'repositories/projects';
import { truncate } from 'hapi-utils/tests';
import * as c from './';

jest.mock('hapi-utils/request', () => ({
  getUser: () => ({ id: 1 }),
}));

jest.mock('repositories/internships', () => ({
  insert: () => Promise.resolve(22),
}));

const noopResp = resp => resp;

describe('projects', () => {
  beforeEach(() =>
    projectRepo.insert({
      userId: 1,
      id: 1,
    })
  );
  it('createHandler', () =>
    c
      .createHandler(
        {
          payload: {
            projectId: 1,
          },
        },
        noopResp
      )
      .then(id => expect(id).toBe(22)));
  afterEach(() => truncate('projects'));
});
