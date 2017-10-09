// @flow
import * as c from './';

jest.mock('hapi-utils/request', () => ({
  getUser: () => {
    return { id: 1 };
  },
}));

jest.mock('repositories/projects', () => ({
  insert: () => Promise.resolve(22),
}));

const noopResp = (resp) => resp;

describe('projects', () => {
  it('createHandler', () => {
    return c.createHandler({}, noopResp)
    .then((id) => {
      return expect(id).toBe(22);
    });
  });
});
