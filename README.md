# koa-file-router

> Generates a [koa-router](https://github.com/alexmingoia/koa-router) instance
> from a directory of files, allowing the path to determine the resulting url.

[![npm version](https://img.shields.io/npm/v/koa-file-router.svg)](https://www.npmjs.com/package/koa-file-router)
[![npm dependencies](https://img.shields.io/david/dominicbarnes/koa-file-router.svg)](https://david-dm.org/dominicbarnes/koa-file-router)
[![npm dev dependencies](https://img.shields.io/david/dev/dominicbarnes/koa-file-router.svg)](https://david-dm.org/dominicbarnes/koa-file-router#info=devDependencies)
[![build status](https://img.shields.io/travis/dominicbarnes/koa-file-router.svg)](https://travis-ci.org/dominicbarnes/koa-file-router)

## Usage

I took a lot of concepts from a [similar project](https://github.com/dominicbarnes/express-resourceful)
I worked on previously.

### Server

```js
var koa = require('koa');
var resources = require('koa-file-router');
var app = koa();

var router = resources('./routes');
app.use(router.routes());
```

### Resources Directory

Each module inside the given resource directory generally will map to a route:

| File | URL |
| ---- | --- |
| index.js | `/` |
| users/index.js | `/users` |
| users/new.js | `/users/new` |
| users/:user.js | `/users/:user` |
| \_params/user.js | *(param)* |

Some things to note:
 - Files named `index.js` will have the trailing `index` stripped
 - Files under `_params/` will be added as param handlers instead of routes
 - Files with a `:` prefix will be mounted **after** static routes. (to keep
   `/users/:user` from pre-empting `/users/new`)

### Resource Module

Each resource module can export a function for any valid HTTP method. (the
property name should be lowercase)

```js
exports.get = function* () {
  // GET handler...
};

exports.post = function* () {
  // POST handler...
};
```

### Param Module

All modules matching `_params/*.js` will be used as params. These modules
should export a single middleware function.

```js
module.exports = function* (next) {
  // param handler...
  yield* next;
};
```

**NOTE:** do not nest params in sub-directories within `_params`, only the
base name of the file is considered when naming the param.

## API

### resources(dir, [options])

This method **synchronously** traverses the given `dir`, and returns a
[koa-router](https://github.com/alexmingoia/koa-router) instance.

Available options include:
 - `prefix`: will be passed to koa-router and used to prefix all URLs
