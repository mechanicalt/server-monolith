exports.up = (pgm) => {
  return pgm.sql(`CREATE OR REPLACE FUNCTION gin_fts_users(username text, description text) 
      RETURNS tsvector
    AS
    $BODY$
        SELECT setweight(to_tsvector($1), 'A') || setweight(to_tsvector($1), 'B');
    $BODY$
    LANGUAGE sql
    IMMUTABLE;

CREATE INDEX idx_fts_users ON users USING gin(gin_fts_users(username, description));
  `);
};

exports.down = (pgm) => {
  return pgm.dropIndex('idx_fts_users');
};

