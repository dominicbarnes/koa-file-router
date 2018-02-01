exports.get = ctx => {
  ctx.body = `Hello, ${ctx.state.user}`;
};
