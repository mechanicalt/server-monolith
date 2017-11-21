// @flow
import { statusTypes } from 'models/Intern';
import { types } from 'hapi-utils/rpc/emails';

export function getInternTemplate(status: number) {
  switch (status) {
    case statusTypes.FIRED:
      return types.internFired;
    default:
      return types.internCompleted;
  }
}

export function getMentorTemplate(status: number) {
  switch (status) {
    case statusTypes.ASSESSMENT_COMPLETED:
      return types.assessmentCompleted;
    default:
      return types.internAwaitingApproval;
  }
}
