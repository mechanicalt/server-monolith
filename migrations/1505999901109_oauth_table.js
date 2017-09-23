exports.up = (pgm) => {
  pgm.createTable('oauth', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
    },
    type: {
      type: 'integer',
    },
    oauth_id: {
      type: 'string',
    },
    created_at: {
      type: 'date',
    },
    updated_at: {
      type: 'date',
    },
  }, {
    constraints: {
      unique: [
        'type',
        'oauth_id',
      ],
    },
  });
};
