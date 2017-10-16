// @flow
export const statusTypes = {
  PENDING: 1,
  OFFERED: 2,
  REJECTED: 3,
};

export default class Application {
  id: number;
  userId: $$id;
  internshipId: $$id;
  status: number;
  constructor(application?: Object = {}) {
    ['id', 'userId', 'internshipId', 'status', 'createdAt'].forEach((key) => {
      this[key] = application[key];
    });
  }
}
