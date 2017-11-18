// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class ApplicationRepo extends Repo {
  getApplicationFromOffer = (id: $$id) => {
    const query = squel
      .select()
      .from('offers')
      .field('applications.*')
      .join('applications', null, 'applications.id = offers.application_id')
      .where('offers.id = ?', id);
    const { text, values } = query.toParam();
    return db.one(text, values);
  };
}

export default new ApplicationRepo('offers', undefined, { justCreate: true });
