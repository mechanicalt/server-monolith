exports.up = (pgm) => {
  pgm.createTable('projects', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    description: {
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
