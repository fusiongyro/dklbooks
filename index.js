var koa = require('koa');
var mount = require('koa-mount');
var proxy = require('koa-proxy');
var serve = require('koa-static');
var errors = require('koa-errors');
var router = require('koa-router')();
var r = require('rethinkdb');

// proxy to the rethinkdb admin panel
var rethinkProxy = koa();
rethinkProxy.use(proxy({host: 'http://localhost:8080/'}));

function* root(next) {
    var cursor = yield r.table('books').filter({ISBN:'9781888009187'}).run(this.db);
    var result = yield cursor.next();
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
        throw err;
    }

    yield next;

    this.db.close();
}

var api = koa();
router.get('/book/:isbn', function*(next) {
    console.log('Got a request for ISBN ' + this.params.isbn);
    var cursor = yield r.table('books')
        .getAll(this.params.isbn, {index:"ISBN"})
        .run(this.db);
    var book = yield cursor.next();
    this.body = JSON.stringify({data: [book]});
    this.type = 'application/vnd.api+json';
    yield next;
});

api.use(router.routes());
api.use(router.allowedMethods());

// set up the main app
var app = koa();

app.use(errors());
app.use(mount('/rethink', rethinkProxy));
//app.use(mount('/static', serve('static')));
//app.use(proxy({host: 'http://localhost:4200/'}));
app.use(connectRethink);
app.use(mount('/api/v1', api));
//app.use(root);

// now listen
app.listen(9000);
console.log('listening on port 9000');
