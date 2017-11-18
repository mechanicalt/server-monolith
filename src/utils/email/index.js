// @flow
/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import EmailTemplate from 'email-templates';
import Handlebars from 'handlebars';
import path from 'path';
import layoutPartial from './partials/layout';

Handlebars.registerPartial('layout', layoutPartial);

const defaultFrom = 'noreply@menternship.org';

const {
  SMTP_HOST,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_PORT = 587,
} = process.env;
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
transporter.verify(error => {
  if (error) {
    console.log(error);
    throw Error();
  } else {
    console.log('Server is ready to take our messages');
  }
});

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
    const template = new EmailTemplate({
      views: {
        root: path.resolve(__dirname, 'templates'),
        options: {
          extension: 'hbs',
          map: {
            hbs: 'handlebars',
          },
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'styles'),
        },
      },
      transport: transporter,
    });
    return template
      .send({
        template: this.templateName,
        message: {
          from: defaultFrom,
          subject: 'Message from menternship',
          ...this.emailProps,
        },
        locals: this.templateProps,
      })
      .catch(console.log);
  };
}

export default (notifications: Email[]) =>
  Promise.all(notifications.map(notification => notification.prepare())).catch(
    console.log
  );
/* eslint-enable no-console */
