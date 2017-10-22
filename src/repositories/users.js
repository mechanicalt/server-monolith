// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class UserRepo extends Repo {
  search = (searchText: string) => {
    const querySearchText = searchText.toLowerCase().replace(/ /g, ' | ');

    const usersWithDocument = squel.select()
    .field('id')
    .field('username')
    .field('description')
    .field(`setweight(to_tsvector(username), 'A') || 
      setweight(to_tsvector(description), 'B')`, 'document')
    .from('users');
    // .where('active = ?', true);

    const query = squel.select()
    .field('id')
    .field('username')
    .field('description')
    .from(usersWithDocument, 'p_search')
    .where('p_search.document @@ to_tsquery(\'simple\', ?)', querySearchText)
    .order('ts_rank(p_search.document, to_tsquery(\'simple\', ?))', false, querySearchText);
    const { text, values } = query.toParam();
    return db.manyOrNone(text, values);
  }
}

export default new UserRepo('users');
