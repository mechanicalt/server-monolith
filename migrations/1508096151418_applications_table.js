exports.up = (pgm) => {
  pgm.createTable('applications', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
    },
    internship_id: {
      type: 'integer',
    },
    status: {
      type: 'integer',
    },
    created_at: {
      type: 'date',
    },
  });
};
