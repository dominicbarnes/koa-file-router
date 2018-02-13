module.exports = (name, ctx, next) => {
  ctx.state.user = name;
  return next();
};
