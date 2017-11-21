// @flow
import { CronJob } from 'cron';
import repo from 'repositories/internships';
import { squel } from 'hapi-utils/repos';

export const onTick = () => {
  return repo.getExpiredPostedAt().then(internships => {
    return repo.update(
      {
        id: internships.map(i => i.id),
      },
      {
        postedAt: squel.str('NOW()'),
      }
    );
  });
};

function register(app: Object, options: Object, pluginNext: Function) {
  const job = new CronJob({
    cronTime: '00 30 11 * * 1-7',
    onTick,
    runOnInit: true,
    timeZone: 'America/Los_Angeles',
  });
  job.start();
  console.log('internship job status', job.running);
  pluginNext();
}
register.attributes = {
  name: 'internships',
  version: '1.0.0',
};

module.exports = register;
