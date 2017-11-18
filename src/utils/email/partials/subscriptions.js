// @flow
export default `
  <p>
    To unsubscribe from this thread,
     click <a href="${
       process.env.BASE_URL
     }/subscriptions/{{subscriptionId}}/unsubscribe/{{unsubscribeToken}}">here</a>
  </p>
`;
