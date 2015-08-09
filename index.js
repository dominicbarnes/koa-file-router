
var debug = require('debug')('koa-file-router');
var each = require('each-module');
var methods = require('methods');
var path = require('path');
var Router = require('koa-router');

module.exports = function (dir, options) {
  if (!options) options = {};
  debug('initializing with options: %j', options);

  var router = new Router({ prefix: options.prefix });
  return mount(router, discover(dir));
};


function discover(dir) {
  var resources = {
    params: [],
    routes: []
  };

  debug('searching %s for resources', dir);

  each(dir, function (id, resource, file) {
    if (id.startsWith('_params')) {
      var name = path.basename(file, '.js');
      debug('found param %s in %s', name, file);
      resources.params.push({
        name: name,
        handler: resource
      });
    } else {
      methods.forEach(function (method) {
        if (method in resource) {
          var url = path2url(id);
          debug('found route %s %s in %s', method.toUpperCase(), url, file);
          resources.routes.push({
            url: url,
            method: method,
            handler: resource[method]
          });
        }
      });
    }
  });

  resources.routes.sort(sorter);

  return resources;
}

function mount(router, resources) {
  resources.params.forEach(function (param) {
    debug('mounting param %s', param.name);
    router.param(param.name, param.handler);
  });

  resources.routes.forEach(function (route) {
    debug('mounting route %s %s', route.method.toUpperCase(), route.url);
    router[route.method](route.url, route.handler);
  });

  return router;
}

function path2url(id) {
  var parts = id.split(path.sep);
  var base = parts[parts.length - 1];

  if (base === 'index') parts.pop();
  return '/' + parts.join('/');
}

function sorter(a, b) {
  var a1 = a.url.split('/').slice(1);
  var b1 = b.url.split('/').slice(1);

  var len = Math.max(a1.length, b1.length);

  for (var x = 0; x < len; x += 1) {
    if (a1[x] === b1[x]) continue;       // same path, try next one
    if (a1[x].startsWith(':')) return 1; // url params always pushed back
    return a1[x] < b1[x] ? -1 : 1;       // normal comparison
  }
}
