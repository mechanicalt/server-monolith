// @flow
import Repo, { db, squel } from 'hapi-utils/repos';
import Application from 'models/Application';

class ApplicationRepo extends Repo {
  getInternshipFromApplication = (id: $$id, t) => {
    const query = squel
      .select()
      .from('applications')
      .field('internships.*')
      .field('projects.user_id')
      .join('internships', null, 'internships.id = applications.internship_id')
      .join('projects', null, 'projects.id = internships.project_id')
      .where('applications.id = ?', id);
    const { text, values } = query.toParam();
    return db.oneOrNone(text, values, t);
  };
}

export default new ApplicationRepo('applications', Application);
