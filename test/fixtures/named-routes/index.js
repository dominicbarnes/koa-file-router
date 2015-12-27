
exports.get = function* () {
  this.body = `Named Route: ${this.router.url('login')}`;
};
