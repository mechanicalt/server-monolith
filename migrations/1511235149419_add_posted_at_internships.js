exports.up = pgm => {
  pgm.addColumn('internships', {
    posted_at: {
      type: 'timestamp',
    },
  });
};
