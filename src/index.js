// @flow
import getRegister from 'hapi-utils/server';

import data from 'controllers/data';

module.exports = getRegister([...data], []);
