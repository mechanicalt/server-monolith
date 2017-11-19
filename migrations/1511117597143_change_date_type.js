exports.up = pgm => {
  pgm.alterColumn('interactions', 'created_at', {
    type: 'timestamp',
  });
};
