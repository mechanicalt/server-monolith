exports.up = (pgm) => {
  pgm.addColumn('users', {
    status: {
      type: 'integer',
    },
  });
};
