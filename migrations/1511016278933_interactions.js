exports.up = pgm => {
  pgm.createTable('interactions', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    ip_address: {
      type: 'string',
    },
    meta: {
      type: 'text',
    },
    path: {
      type: 'string',
    },
    query: {
      type: 'string',
    },
    user_id: {
      type: 'integer',
    },
    created_at: {
      type: 'date',
    },
  });
};
