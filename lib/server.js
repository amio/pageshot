const Koa = require('koa')
const serve = require('koa-static')
const pageshot = require('./pageshot.js')

module.exports = function ({ port = 3000, chromePort = 9222 }) {
  const app = new Koa()

  app.use(pageshot({chromePort, path: '/shot'}))
  app.use(serve('./public'))
  app.listen(port, () => {
    console.log(`Pageshot server running on ${port}`)
  })

  return app
}
