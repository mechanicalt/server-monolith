// @flow
import joi from 'joi';
import controller from 'hapi-utils/controllers';
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import * as utils from 'utils/oauth';
import * as services from 'services/oauth';

export const getLinkedInAuthUrlHandler = (req: *, reply: *) => reply(utils.getLinkedInAuthUrl());

const getLinkedInAuthUrl = {
  method: 'GET',
  path: '/linked_in_auth_url',
  handler: getLinkedInAuthUrlHandler,
  config: {
    auth: false,
  },
};

export const linkedInRedirectHandler = (req: *, reply: *) => 
  // console.log(req.params.url);
  fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify({
      grant_type:	'authorization_code',
      code: req.query.code,
      redirect_uri:	utils.getLinkedInRedirectUrl(),
      client_id: process.env.LINKED_IN_CLIENT_ID,
      client_secret: process.env.LINKED_IN_CLIENT_SECRET,
    }),
  })
  .then(resp => {
    console.log(resp);
    return resp.json();
  })
  .then((json)=>{
    console.log(json);
    const { access_token: token } = json;
    return fetch('https://api.linkedin.com/v1/people/~:(email-address,id,firstName,lastName,picture-url)?format=json', {
      method: 'GET',
      headers: {
        Connection: 'Keep-Alive',
        Authorization: `Bearer ${token}`,
        'x-li-format': 'json',
      },
    });
  })
  .then((resp) => {
    console.log('resp', resp);
    return resp.json();
  })
  .then((json) => {
    console.log(json);
    const {
      firstName,
      lastName,
      id,
      pictureUrl: imageUrl,
      emailAddress: email,
    } = json;
    return services.linkedInOAuth(id, { username: `${firstName} ${lastName}`, email, imageUrl });
  })
  .then((finalUrl) => {
    return reply().redirect(finalUrl);
  });

const linkedInRedirect = {
  method: 'GET',
  path: '/linked_in_redirect',
  handler: linkedInRedirectHandler,
  config: {
    auth: false,
    validate: {
      query: {
        code: joi.string().required(),
        state: joi.string().required(),
      },
    },
  },
};

export default controller('oauth', [
  getLinkedInAuthUrl,
  linkedInRedirect,
]);
