// @flow

export function getTokenFromHeaders(req: Object) {
  return req.headers.authorization;
}

export function getUserFromAuth(req: Object) {
  return req.auth.credentials;
}
