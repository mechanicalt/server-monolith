// @flow
import { types } from 'hapi-utils/rpc/emails';
import { Email } from './';

describe('emailUtils', () => {
  it('createOffer', () => {
    const email = new Email(types.createOffer, {to: 'example@menternship.org', subject: 'hello'}, {});
    return email.prepare().then((finalEmail) => {
      console.log('finalEmail', finalEmail);
      expect(finalEmail.envelope).toMatchSnapshot();
    });
  });
  it('acceptOffer', () => {
    const email = new Email(types.acceptOffer, {to: 'example@menternship.org', subject: 'hello'}, {});
    return email.prepare().then((finalEmail) => {
      console.log('finalEmail', finalEmail);
      expect(finalEmail.envelope).toMatchSnapshot();
    });
  });
  it('rejectOffer', () => {
    const email = new Email(types.rejectOffer, {to: 'example@menternship.org', subject: 'hello'}, {});
    return email.prepare().then((finalEmail) => {
      console.log('finalEmail', finalEmail);
      expect(finalEmail.envelope).toMatchSnapshot();
    });
  });
});
