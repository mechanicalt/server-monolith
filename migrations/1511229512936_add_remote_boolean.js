exports.up = pgm => {
  pgm.addColumn('internships', {
    remote: {
      type: 'boolean',
    },
  });
};
