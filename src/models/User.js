// @flow
import md5 from 'md5';

export default class User {
  id: number;
  email: string;
  username: string;
  constructor(user: Object) {
    this.id = user.id;
    this.email = md5(user.email);
    this.username = user.username;
  }
}
