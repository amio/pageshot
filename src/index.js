const Koa = require('koa')
const serve = require('koa-static')
const router = require('koa-route')
const pageshot = require('./pageshot.js')

module.exports = async function (port = 3000) {
  const app = new Koa()

  app.use(router.get('/shot', pageshot))
  app.use(serve('public'))

  app.listen(port, () => {
    console.log(`Pageshot server running on ${port}`)
  })

  app.on('error', err => {
    console.error('ERR_APP:', err)
  })

  return app
}

module.exports()

process.on('uncaughtException', err => {
  console.error(`UncaughtException: ${err}`)
  process.exit(1)
})
