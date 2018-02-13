exports.get = [
  ctx => {
    ctx.throw(403)
  },
  ctx => {
    ctx.body = 'Hello World'
  }
]
