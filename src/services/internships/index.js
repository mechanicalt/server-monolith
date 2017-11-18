// @flow
import boom from 'boom';
import repo from 'repositories/internships';

export const doesUserOwnInternship = (userId: $$id, internshipId: $$id) =>
  repo
    .getInternshipWithUserId(internshipId)
    .then(internship => internship.userId === userId);

export const doesUserOwnInternshipError = (userId: $$id, internshipId: $$id) =>
  doesUserOwnInternship(userId, internshipId).then(res => {
    if (!res) {
      throw boom.unauthorized('You do not own this internship');
    }
  });
