
exports.get = function* () {
  this.body = `Page: ${this.params.page}`;
};
