// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class InternshipRepo extends Repo {
  byUser = () => {
    return this.retrieveAll();
  }
  search = (searchText: string) => {
    const query = squel.select()
    .field('*')
    .from('internships')
    .where('active = ?', true)

    const { text, values } = query.toParam();
    return db(text, values);
  }
}

export default new InternshipRepo('internships');
