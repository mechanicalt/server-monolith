// @flow
export const statusTypes = {
  PENDING: 1,
  OFFERED: 2,
  REJECTED: 3,
  OFFER_REJECTED: 4,
  OFFER_ACCEPTED: 5,
};

export default class Application {
  id: number;
  userId: $$id;
  internshipId: $$id;
  status: number;
  createdAt: Date;
  constructor(application?: Object = {}) {
    ['id', 'userId', 'internshipId', 'status', 'createdAt'].forEach((key) => {
      // $FlowFixMe
      this[key] = application[key];
    });
  }
}
