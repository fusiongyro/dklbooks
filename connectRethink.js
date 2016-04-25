var r = require('rethinkdb');

// middleware to connect to RethinkDB
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


module.exports = connectRethink;