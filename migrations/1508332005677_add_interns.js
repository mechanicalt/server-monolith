exports.up = (pgm) => {
  pgm.createTable('interns', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    minutes: {
      type: 'integer',
    },
    status: {
      type: 'integer',
    },
    user_id: {
      type: 'integer',
    },
    internship_id: {
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
