// @flow
import nodemailer from 'nodemailer';
import EmailTemplate from 'email-templates';
import Handlebars from 'handlebars';
import path from 'path';
import htmlToText from 'html-to-text';
import layoutPartial from './partials/layout';

Handlebars.registerPartial('layout', layoutPartial);

const defaultFrom = 'noreply@title.org';

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
    return template.send({
      template: this.templateName,
      message: {
        ...this.emailProps,
        from: this.emailProps.from || defaultFrom,
      },
      locals: this.templateProps,
    })
    .catch(console.log);
  }
}

// const transport = (mailOptions: Object) => new Promise((resolve, reject) => {
//   transporter.sendMail(mailOptions, (error) => {
//     if (error) {
//       reject(error);
//     }
//     resolve();
//   });
// });


export default (notifications: Email[]) => {
  return Promise.all(notifications.map(notification => notification.prepare())).catch(console.log);
};

