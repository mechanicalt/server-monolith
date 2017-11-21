// @flow
import { CronJob } from 'cron';
import repo from 'repositories/internships';
import { squel } from 'hapi-utils/repos';

function register(app: Object, options: Object, pluginNext: Function) {
  const job = new CronJob(
    '00 30 11 * * 1-7',
    () => {
      return this.getExpiredPostedAt().then(internships => {
        repo.update(
          {
            id: internships.map(i => i.id),
          },
          {
            postedAt: squel.str('NOW()'),
          }
        );
      });
    },
    () => {
      console.log('cron job update posted at internships completed');
    },
    true,
    'America/New_York'
  );
  job.start();
  pluginNext();
}
register.attributes = {
  name: 'internships',
  version: '1.0.0',
};

module.exports = register;
