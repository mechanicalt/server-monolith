exports.up = (pgm) => {
  pgm.addColumn('users', {
    linked_in_url: {
      type: 'string',
    },
  });
};
