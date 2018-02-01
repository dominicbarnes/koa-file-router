exports.get = ctx => {
  ctx.body = `Page: ${ctx.params.page}`;
};
