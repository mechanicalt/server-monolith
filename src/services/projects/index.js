// @flow
import boom from 'boom';
import repo from 'repositories/projects';

export const doesUserOwnProject = (userId: $$id, id: $$id) =>
  repo
    .retrieve({
      id,
      userId,
    })
    .then(project => {
      if (project) return true;
      throw boom.unauthorized('You do not own the project');
    });
