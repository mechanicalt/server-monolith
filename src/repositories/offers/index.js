// @flow
import Repo from 'hapi-utils/repos';

class ApplicationRepo extends Repo {
}

export default new ApplicationRepo('offers', undefined, { justCreate: true });
