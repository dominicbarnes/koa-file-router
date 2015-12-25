
exports.get = [
  function* (next) {
    if (!this.session.auth) this.throw(403);
    yield* next;
  },
  function* () {
    this.body = 'Hello World';
  }
];
