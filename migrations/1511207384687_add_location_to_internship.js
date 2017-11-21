exports.up = pgm => {
  pgm.addColumn('internships', {
    location: {
      type: 'string',
    },
  });
};
