exports.up = pgm => {
  pgm.createTable('data', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    created_at: {
      type: 'date',
    },
    data: {
      type: 'text',
    },
  });
};
