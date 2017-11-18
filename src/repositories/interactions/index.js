// @flow
import Repo from 'hapi-utils/repos';

class InteractionRepo extends Repo {}

export default new InteractionRepo('interactions', undefined, {
  justCreate: true,
});
