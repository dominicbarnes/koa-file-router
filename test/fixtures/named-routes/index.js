exports.get = ctx => {
  ctx.body = `Named Route: ${ctx.router.url('login')}`
}
