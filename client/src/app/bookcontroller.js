export default class BookController {
  constructor($log, $http) {
    $http.get('/api/v1/book/9780940118355')
      .then(result => this.book = result.data[0]);
  }
}
