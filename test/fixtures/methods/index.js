const methods = require('methods')

const handler = ctx => {
  ctx.body = 'Hello World'
}

methods.forEach(function (method) {
  exports[method] = handler
})
