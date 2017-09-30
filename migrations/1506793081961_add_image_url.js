exports.up = (pgm) => {
  pgm.addColumn('users', {
    image_url: {
      type: 'string',
    },
  });
};
