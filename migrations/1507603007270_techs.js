exports.up = (pgm) => {
  pgm.createTable('techs', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'string',
    },
    created_at: {
      type: 'date',
    },
  });
};
