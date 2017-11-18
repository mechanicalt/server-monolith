// @flow
export const statusTypes = {
  ACTIVE: 1,
  INACTIVE: 2,
  PREACTIVE: 3,
};

export default class Internship {
  id: number;
  name: string;
  description: string;
  projectId: $$id;
  status: number;
  constructor(internship: Object = {}) {
    ['id', 'name', 'description', 'projectId', 'status', 'createdAt'].forEach(
      key => {
        this[key] = internship[key];
      }
    );
  }
  isActive = () => this.status === statusTypes.ACTIVE;
}
