var koa = require('koa');
var mount = require('koa-mount');
var proxy = require('koa-proxy');
var serve = require('koa-static');
var errors = require('koa-errors');

// my modules
var connectPostgres = require('./connectPostgres');
var api = require('./api');

function* root(next) {
  var books = yield this.knex.select().table('books');
  this.body = JSON.stringify(books);
  yield next;
}

// set up the main app
var app = koa();

app.use(errors());
//app.use(mount('/static', serve('static')));
//app.use(proxy({host: 'http://localhost:4200/'}));
app.use(connectPostgres);
app.use(mount('/api/v1', api));
app.use(root);

// now listen
app.listen(9000);
console.log('listening on port 9000');
