
module.exports = function* (name, next) {
  this.user = name;
  yield* next;
};
