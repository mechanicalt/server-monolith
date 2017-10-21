// @flow
import boom from 'boom';
import repo from 'repositories/internships';

export const doesUserOwnInternship = (userId: $$id, internshipId: $$id) => {
  return repo.getInternshipWithUserId(internshipId).then((internship) => {
    return (internship.userId === userId);
  });
};

export const doesUserOwnInternshipError = (userId: $$id, internshipId: $$id) => {
  return doesUserOwnInternship(userId, internshipId).then((res) => {
    if (!res) {
      throw boom.unauthorized('You do not own this internship');
    }
  });
};
