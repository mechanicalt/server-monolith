// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class UserRepo extends Repo {
  findEmail = (email: string) => {
    const queryString = squel.select('COUNT(id)')
    .from(this.tableName)
    .where('email = ?', email)
    .limit(1)
    .toString();
    return db.oneOrNone(queryString);
  }
}

export default new UserRepo('users');
