// @flow

import { Email } from './';

describe('emailUtils', () => {
  it('Email', () => {
    const email = new Email('createOffer', {to: 'example@menternship.org', subject: 'hello'}, {});
    return email.prepare().then((finalEmail) => {
      expect(finalEmail.envelope).toMatchSnapshot();
    });
  });
});
