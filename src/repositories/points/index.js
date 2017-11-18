// @flow
import Repo, { db, squel } from 'hapi-utils/repos';

class PointsRepo extends Repo {
  getTotalPointsPerInternship = (ids: Array<$$id>) => {
    const query = squel
      .select()
      .field('internship_id')
      .field('SUM(points)::Integer', 'points')
      .from('points', 'p')
      .where('internship_id in ?', ids)
      .group('internship_id');
    const { text, values } = query.toParam();
    return db.manyOrNone(text, values);
  };
}

export default new PointsRepo('points', undefined, { justCreate: true });
