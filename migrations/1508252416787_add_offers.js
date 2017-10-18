exports.up = (pgm) => {
  pgm.createTable('offers', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    application_id: {
      type: 'integer',
    },
    message: {
      type: 'text',
    },
    created_at: {
      type: 'date',
    },
    updated_at: {
      type: 'date',
    },
  });
};
