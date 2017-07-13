const { restart } = require('./chrome-daemon.js')

module.exports = function ({chromePort = 9222, path = '/restart'} = {}) {
  return async (ctx, next) => {
    if (ctx.url === path) {
      const result = await restart({port: chromePort}).catch(e => e.toString())
      ctx.body = result
    } else {
      next()
    }
  }
}
