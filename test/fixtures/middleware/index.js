
exports.get = [
  function* () {
    this.throw(403);
  },
  function* () {
    this.body = 'Hello World';
  }
];
