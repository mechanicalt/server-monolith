// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class InternshipRepo extends Repo {
  byUser = () => {
    return this.retrieveAll();
  }
  search = (searchText: string) => {
    const querySearchText = searchText.toLowerCase().replace(/ /g, ' | ');

    const internshipsWithDocument = squel.select()
    .field('id')
    .field('name')
    .field('description')
    .field(`setweight(to_tsvector(name), 'A') || 
      setweight(to_tsvector(description), 'B')`, 'document')
    .from('internships')
    // .where('active = ?', true);

    const query = squel.select()
    .field('id')
    .field('name')
    .field('description')
    .from(internshipsWithDocument, 'p_search')
    .where(`p_search.document @@ to_tsquery('english', ?)`, querySearchText)
    .order(`ts_rank(p_search.document, to_tsquery('english', ?))`, false, querySearchText)

    const { text, values } = query.toParam();
    return db.manyOrNone(text, values);
  }
}

export default new InternshipRepo('internships');
