var knex = require('knex')({
  client: 'pg',
  connection: 'postgres://localhost/books'
});

function* connectPostgres(next) {
  this.knex = knex;
  yield next;
}

module.exports = connectPostgres;