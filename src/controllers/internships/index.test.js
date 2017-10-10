// @flow
import projectRepo from 'repositories/projects';
import { truncate } from 'hapi-utils/tests';
import * as c from './';

jest.mock('hapi-utils/request', () => ({
  getUser: () => {
    return {id: 1};
  },
}));

jest.mock('repositories/internships', () => ({
  insert: () => {
    return Promise.resolve(22);
  },
}));

const noopResp = (resp) => resp;

describe('projects', () => {
  beforeEach(()=>{
    return projectRepo.insert({
      userId: 1,
      id: 1,
    });
  });
  it('createHandler', () => {
    return c.createHandler({payload: {
      projectId: 1,
    }}, noopResp)
    .then((id) => {
      return expect(id).toBe(22);
    });
  });
  afterEach(()=>{
    return truncate('projects');
  });
});
