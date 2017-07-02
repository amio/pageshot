const CDP = require('chrome-remote-interface')

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
  return new Buffer(data, 'base64')
}

module.exports = function ({ chromePort = 9222, path = '/shot' }) {
  return async function middleware (ctx, next) {
    if (ctx.path !== path || !ctx.query.url) return await next()

    try {
      const { url, height, width, full } = ctx.query
      const viewportWidth = parseInt(width, 10) || 1280
      const viewportHeight = parseInt(height, 10) || 800

      // https://github.com/cyrus-and/chrome-remote-interface/issues/127#issuecomment-301421924
      const tab = await CDP.New({port: chromePort, url})
      const client = await CDP({tab})

      await capture({client, viewportHeight, viewportWidth, full}).then(image => {
        ctx.response.type = 'image/png'
        ctx.response.body = image
      }).catch(e => {
        console.error('ERR CAPTURE:', e)
        ctx.response.body = { error: e }
      })

      await CDP.Close({id: tab.id})
    } catch (e) {
      ctx.throw(500, { error: e.stack ? e.stack.toString() : JSON.stringify(e) })
      console.error('ERR MIDDLEWARE:', ctx.body)
    }
  }
}
