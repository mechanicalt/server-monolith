exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    email: {
      type: 'string',
      unique: true,
    },
    username: {
      type: 'string',
      unique: true,
    },
    login_token: {
      type: 'string',
    },
    email_token: {
      type: 'string',
    },
    confirmed_email: {
      type: 'date',
    },
    remember_token: {
      type: 'string',
    },
    created_at: {
      type: 'date',
    },
    updated_at: {
      type: 'date',
    },
  });
};
