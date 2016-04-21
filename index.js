var koa = require('koa');
var mount = require('koa-mount');
var proxy = require('koa-proxy');
var serve = require('koa-static');
var errors = require('koa-errors');
var r = require('rethinkdb');

// proxy to the rethinkdb admin panel
var rethinkProxy = koa();
rethinkProxy.use(proxy({host: 'http://localhost:8080/'}));

function* root(next) {
  var result = yield r.table('books').get('01b1d78e-1fa4-4f95-862b-b9e8f4515f01').run(this.db);
  this.body = JSON.stringify(result);
  //this.body = '<p>Test from Koa</p>';
  yield next;
}

function* connectRethink(next) {
  try {
    this.db = yield r.connect({db: 'books'});
  }
  catch (err) {
    this.status = 500;
    this.body = err.message || http.STATUS_CODES[this.status];
  }

  yield next;

  this.db.close();
}

// set up the main app
var app = koa();
app.use(errors());
app.use(mount('/rethink', rethinkProxy));
app.use(mount('/static',  serve('static')));
app.use(connectRethink);
app.use(root);

// now listen
app.listen(80);
console.log('listening on port 80');

