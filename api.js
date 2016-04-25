var koa = require('koa');
var router = require('koa-router')();
var r = require('rethinkdb');

// let's make a middleware
var api = koa();

// GET /book/:ISBN
router.get('/book/:isbn', function*(next) {
  console.log('Got a request for ISBN ' + this.params.isbn);
  var cursor = yield r.table('books')
    .getAll(this.params.isbn, {index: "ISBN"})
    .run(this.db);
  var book = yield cursor.next();
  this.body = JSON.stringify({data: [book]});
  this.type = 'application/vnd.api+json';
  yield next;
});

// other things? possibly:
// GET /book/search?q=...
// GET /checkout/:CHECKOUT
// POST /checkout/new
// POST /checkout/return/:CHECKOUT
// POST /request

api.use(router.routes());
api.use(router.allowedMethods());

module.exports = api;