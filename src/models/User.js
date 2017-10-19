// @flow
export default class User {
  id: number;
  username: string;
  imageUrl: string;
  linkedInUrl: string;
  constructor(user: Object = {}) {
    this.id = user.id;
    this.username = user.username;
    this.imageUrl = user.imageUrl;
    this.linkedInUrl = user.linkedInUrl;
  }
}
