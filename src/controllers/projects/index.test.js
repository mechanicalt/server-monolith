// @flow
import { truncate } from 'hapi-utils/tests';
import repo from 'repositories/projects';
import * as c from './';

jest.mock('hapi-utils/request', () => ({
  getUser: () => ({ id: 1 }),
}));

// jest.mock('repositories/projects', () => ({
//   insert: () => Promise.resolve(22),
//   update:
// }));

const noopResp = resp => resp;

describe('projects', () => {
  it('createHandler', () =>
    c.createHandler({}, noopResp).then(id => expect(typeof id).toBe('number')));
  it('editHandler', () => {
    const payload = {
      name: 'Example',
      description: 'Example Description',
    };

    return repo
      .insert({
        userId: 1,
      })
      .then(id => {
        const params = { id };
        return c.editHandler({ payload, params }, noopResp).then(() =>
          repo
            .retrieve({
              id,
            })
            .then(project => {
              expect(project.name).toBe('Example');
              return expect(project.description).toBe('Example Description');
            })
        );
      });
  });
  afterEach(() => truncate('projects'));
});
