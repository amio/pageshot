const CDP = require('chrome-remote-interface')
const debuglog = require('./debuglog.js')
const { healthCheck } = require('./chrome-daemon.js')

async function capture ({ client, viewportHeight, viewportWidth, full }) {
  const { Page, Network, Emulation } = client

  await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight})
  await Network.enable()
  await Page.enable()
  await Page.loadEventFired()

  // full page shot
  if (full) {
    const { contentSize } = await Page.getLayoutMetrics()
    const { width, height } = contentSize
    await Emulation.setVisibleSize({width, height})
  }

  const { data } = await Page.captureScreenshot()
  return Buffer.from(data, 'base64')
}

module.exports = function ({ chromePort = 9222, path = '/shot' }) {
  return async function pageshotMiddleware (ctx, next) {
    if (ctx.path !== path || !ctx.query.url) return await next()

    const { response } = ctx

    try {
      const { url, height, width, full } = ctx.query
      const viewportWidth = parseInt(width, 10) || 1280
      const viewportHeight = parseInt(height, 10) || 800

      // https://github.com/cyrus-and/chrome-remote-interface/issues/127#issuecomment-301421924
      const tab = await CDP.New({port: chromePort, url})
      const client = await CDP({tab})

      console.time(url)
      await capture({client, viewportHeight, viewportWidth, full}).then(image => {
        response.type = 'image/png'
        response.body = image
      }).catch(e => {
        response.code = 400
        response.body = { error: e }
        debuglog('ERR_CAPTURE:', response.body.error)
      })
      console.timeEnd(url)

      await CDP.Close({id: tab.id})
    } catch (e) {
      response.code = 500
      response.body = { error: e.stack || e }
      debuglog('ERR_MIDDLEWARE:', response.body.error)
      await healthCheck({port: chromePort})
      process.exit(1)
    }
  }
}
