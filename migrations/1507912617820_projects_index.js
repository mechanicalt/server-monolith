exports.up = (pgm) => {
  return pgm.sql(`
CREATE INDEX idx_fts_projects ON projects USING gin(gin_fts_fct(name, description));
  `);
};

exports.down = (pgm) => {
  return pgm.dropIndex('idx_fts_projects');
};

