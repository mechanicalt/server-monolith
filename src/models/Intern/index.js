// @flow
export const statusTypes = {
  ACTIVE: 1,
  AWAITING_APPROVAL: 2,
  FIRED: 3,
  COMPLETED: 4,
  WILL_NOT_COMPLETE: 5,
};

export default class Intern {
  id: number;
  userId: $$id;
  internshipId: $$id;
  status: number;
  minutes: number;
  createdAt: Date;
  updateAt: Date;
  constructor(application?: Object = {}) {
    ['id', 'userId', 'internshipId', 'status', 'minutes', 'createdAt', 'updatedAt'].forEach((key) => {
      // $FlowFixMe
      this[key] = application[key];
    });
  }
}
