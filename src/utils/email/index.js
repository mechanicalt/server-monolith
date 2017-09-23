// @flow
import nodemailer from 'nodemailer';
import { EmailTemplate } from 'email-templates';
import Handlebars from 'handlebars';
import path from 'path';
import subscriptionPartial from './partials/subscriptions';

const getTemplatePath = (name: string) => path.resolve(__dirname, 'templates', name);

Handlebars.registerPartial('subscription', subscriptionPartial);

const defaultFrom = 'noreply@title.org';

export class Email {
  emailProps: Object;
  templateProps: Object;
  templateName: string;
  constructor(templateName: string, emailProps: Object, templateProps: Object) {
    this.templateName = templateName;
    this.emailProps = emailProps;
    this.templateProps = templateProps;
  }
  prepare = () => {
    const template = new EmailTemplate(getTemplatePath(this.templateName));
    return new Promise((resolve, reject) => {
      template.render(this.templateProps, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    }).then(({ text, html }) => {
      return {
        text,
        html,
        ...this.emailProps,
        from: this.emailProps.from || defaultFrom,
      };
    });
  }
}

const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT = 587 } = process.env;
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

// verify connection configuration
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
        throw Error()
   } else {
        console.log('Server is ready to take our messages');
   }
});


const transport = (mailOptions: Object) => new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      reject(error);
    }
    resolve();
  });
});


export default (notifications: Email[]) => {
  return Promise.all(notifications.map(notification => notification.prepare()))
  .then(preparedNotifications => Promise.all(preparedNotifications.map(transport))).catch(console.log);
};

