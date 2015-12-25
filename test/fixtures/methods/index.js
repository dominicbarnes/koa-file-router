
var methods = require('methods');

methods.forEach(function (method) {
  exports[method] = handler;
});

function* handler() {
  this.body = 'Hello World';
}
