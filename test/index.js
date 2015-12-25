
var assert = require('chai').assert;
var Router = require('koa-router');
var path = require('path');
var resources = require('..');

var fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('resources(dir, [options])', function () {
  it('should be a function', function () {
    assert.isFunction(resources);
  });

  it('should return a koa-router instance', function () {
    var router = resources(fixture('simple'));
    assert.instanceOf(router, Router);
  });

  it('should incorporate the directories into the path', function () {
    var router = resources(fixture('nested'));
    assert.ok(hasRoute(router, '/a'));
    assert.notOk(hasRoute(router, '/'));
  });

  it('should allow any http method', function () {
    var router = resources(fixture('methods'));
    assert.ok(hasRoute(router, '/', 'get'));
    assert.ok(hasRoute(router, '/', 'post'));
    assert.ok(hasRoute(router, '/', 'put'));
    assert.ok(hasRoute(router, '/', 'delete'));
    assert.notOk(hasRoute(router, '/', 'options'));
  });

  it('should sort routes intelligently', function () {
    var router = resources(fixture('sort-order'));

    // make sure the static /page is not clobbered by the dynamic /:page
    assert.equal(router.match('/page', 'GET').route.path, '/page');

    // make sure the root page is not affected weirdly by other dynamic routes
    assert.equal(router.match('/', 'GET').route.path, '/');
  });

  it('should add a prefix to the urls', function () {
    var router = resources(fixture('simple'), { prefix: '/api' });
    assert.ok(hasRoute(router, '/api', 'get'));
  });

  it('should load params', function () {
    var router = resources(fixture('params'));
    assert.property(router.params, 'user');
  });

  it('should include middleware fns', function () {
    var router = resources(fixture('middleware'));
    assert.equal(router.match('/', 'GET').route.fns.middleware.length, 2);
  });
});


/**
 * Given the input router, check to see if it has a route matching the
 * given `method` and `url`.
 *
 * If no `method` is specified, it will not require a matching method,
 * only the `url` will be checked.
 *
 * @param {Router} router    The koa-router instance.
 * @param {String} url       The url to search for.
 * @param {String} [method]  The (optional) method to search for.
 * @return {Boolean}
 */
function hasRoute(router, url, method) {
  if (method) return !!router.match(url, method.toUpperCase()).route;
  return !!router.match(url).layers.length;
}
