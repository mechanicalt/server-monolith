// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class OauthRepo extends Repo {
  findUser = (profileId, type) => {
    const query = squel
    .select()
    .from('oauth')
    .field('users.id', 'id')
    .field('users.confirmed_email')
    .field('users.email')
    .field('users.username')
    .field('users.email_token')
    .join('users', null, 'users.id = oauth.user_id')
    .where('oauth.oauth_id = ?', profileId)
    .where('oauth.type = ?', type);
    const { text, values } = query.toParam();
    return db.oneOrNone(text, values);
  }
}

export default new OauthRepo('oauth');
