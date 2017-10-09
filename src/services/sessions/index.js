// @flow
import jwt from 'jsonwebtoken';

export function create({ id, username }) {
  return new Promise((resolve, reject) => {
    jwt.sign({ id, username }, process.env.JWT_SECRET, {}, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}
