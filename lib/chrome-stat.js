const proxy = require('koa-proxies')

module.exports = function ({chromePort = 9222, path = '/stat'} = {}) {
  return proxy(path, {
    target: `http://localhost:${chromePort}`,
    rewrite: path => path.replace(path, '/json')
  })
}
