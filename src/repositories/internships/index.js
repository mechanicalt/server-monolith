// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class InternshipRepo extends Repo {
  byUser = () => {
    return this.retrieveAll();
  }
}

export default new InternshipRepo('internships');
