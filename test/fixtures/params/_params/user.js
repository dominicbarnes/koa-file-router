
module.exports = function* (next) {
  this.user = this.params.user;
  yield* next;
};
