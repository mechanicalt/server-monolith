import qs from 'qs';

export function getLinkedInRedirectUrl() {
  return `${process.env.BASE_URL}/oauth/linked_in_redirect`;
}

export function getLinkedInAuthUrl() {
  return `https://www.linkedin.com/oauth/v2/authorization?${qs.stringify({
    redirect_uri: getLinkedInRedirectUrl(),
    state: 'DCEeFWf45A53sdfKef424',
    response_type: 'code',
    client_id: process.env.LINKED_IN_CLIENT_ID,
  })}`;
}

export const types = {
  GOOGLE: 1,
  LINKEDIN: 2,
};
