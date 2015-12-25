
exports.get = function* () {
  this.body = `Hello, ${this.user}`;
};
