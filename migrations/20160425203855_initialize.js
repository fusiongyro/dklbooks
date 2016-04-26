exports.up = function(knex, Promise) {
  return knex.schema
    .raw("CREATE EXTENSION isn")
    .raw("CREATE TABLE books " +
      "(id serial primary key, " +
       "isbn issn unique, " +
       "title varchar not null, " +
       "author varchar not null" +
      ")");
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('books')
    .raw("DROP EXTENSION isn");
};
