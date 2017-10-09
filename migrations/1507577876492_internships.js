exports.up = (pgm) => {
  pgm.createTable('internships', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    project_id: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    status: {
      type: 'integer',
    },
    created_at: {
      type: 'date',
    },
    updated_at: {
      type: 'date',
    },
  });
};
