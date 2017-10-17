exports.up = (pgm) => {
  pgm.addColumn('applications', {
    updated_at: {
      type: 'date',
    },
  });
};
