// @flow
import Repo, { db, squel } from 'hapi-utils/repos';
import Application from 'models/Application';

class ApplicationRepo extends Repo {
}

export default new ApplicationRepo('applications', Application, { justCreate: true });
