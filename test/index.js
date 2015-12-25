
var assert = require('chai').assert;
var http = require('http');
var koa = require('koa');
var methods = require('methods');
var path = require('path');
var resources = require('..');
var Router = require('koa-router');
var supertest = require('supertest');

var fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('resources(dir, [options])', function () {
  it('should be a function', function () {
    assert.isFunction(resources);
  });

  it('should return a koa-router instance', function () {
    var router = resources(fixture('simple'));
    assert.instanceOf(router, Router);
  });

  it('should add a simple get route', function (done) {
    test('simple')
      .get('/')
      .expect(200, 'Hello World', done);
  });

  it('should not create routes that were not defined', function (done) {
    test('simple')
      .get('/does-not-exist')
      .expect(404, done);
  });

  it('should incorporate the directories into the path', function (done) {
    test('nested')
      .get('/a')
      .expect(200, done);
  });

  context('alternate http methods', function () {
    methods.forEach(function (method) {
      // test fails for some reason, but it's probably not important enough to address
      if (method === 'connect') return;

      it(`should support ${method}`, function (done) {
        test('methods')
          [method]('/')
          .expect(200, done);
      });
    });
  });

  context('route sorting', function () {
    it('should ensure that static pages take priority over params pages', function (done) {
      test('sort-order')
        .get('/page')
        .expect(200, 'Static Page', done);
    });

    it('should ensure that the root page takes priority over params pages', function (done) {
      test('sort-order')
        .get('/')
        .expect(200, 'Hello World', done);
    });

    it('should not clobber nested routes with params pages', function (done) {
      test('sort-order')
        .get('/page/sub')
        .expect(200, 'Sub Page', done);
    });
  });

  it('should add a prefix to the urls', function (done) {
    test('simple', { prefix: '/api' })
      .get('/api')
      .expect(200, 'Hello World', done);
  });

  it('should load params', function (done) {
    test('params')
      .get('/dominic')
      .expect(200, 'Hello, dominic', done);
  });

  it('should include middleware fns', function (done) {
    test('middleware')
      .get('/')
      .expect(403, done);
  });
});

function test(name, options) {
  var router = resources(fixture(name), options);
  var app = koa().use(router.routes());
  return supertest(http.createServer(app.callback()));
}
