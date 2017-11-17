exports.up = (pgm) => {
  pgm.createTable('points', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    internship_id: {
      type: 'integer',
    },
    action: {
      type: 'integer',
    },
    action_id: {
      type: 'integer',
    },
    positive: {
      type: 'boolean',
    },
    points: {
      type: 'integer',
    },
    created_at: {
      type: 'date',
    },
  });
};
