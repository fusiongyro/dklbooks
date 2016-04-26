var koa = require('koa');
var router = require('koa-router')();

// let's make a middleware
var api = koa();

// GET /book/:ISBN
router.get('/book/:isbn', function*(next) {
  console.log('Got a request for ISBN ' + this.params.isbn);
  var book = yield this.knex.select().from('books').where({'isbn': this.params.isbn});
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