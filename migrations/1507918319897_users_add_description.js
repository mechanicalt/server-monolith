exports.up = (pgm) => {
  pgm.addColumn('users', {
    description: {
      type: 'string',
    },
  });
};
