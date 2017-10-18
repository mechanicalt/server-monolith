// @flow
import Repo, { db, squel } from 'hapi-utils/repos';
import Intern from 'models/Intern';

class InternRepo extends Repo {
  getInternshipFromIntern = (internId) => {
    const query = squel.select()
    .field('interns.*')
    .field('projects.user_id')
    .from('interns')
    .join('internships', null, 'internships.id = interns.internship_id')
    .join('projects', null, 'projects.id = internships.project_id')
    .where('interns.id = ?', internId);
    const { text, values } = query.toParam();
    return db.one(text, values);
  }
}

export default new InternRepo('interns', Intern);
