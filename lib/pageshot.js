const CDP = require('chrome-remote-interface')

const cdp = function (options) {
  return new Promise(function (resolve, reject) {
    CDP(options, resolve).on('error', reject)
  })
}

async function capture ({ client, url, viewportHeight, viewportWidth }) {
  const { Page, Network, Emulation } = client

  await Network.enable()
  await Page.enable()
  await Page.navigate({url})

  return new Promise(function (resolve, reject) {
    Page.loadEventFired(async () => {
      await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight})
      const captured = await Page.captureScreenshot({format: 'png'})
      resolve(new Buffer(captured.data, 'base64'))
      client.close()
    })
  })
}

module.exports = function ({ chromePort = 9222, path = '/shot' }) {
  return async function middleware (ctx, next) {
    if (ctx.path !== path || !ctx.query.url) return await next()

    try {
      const { url, height, width } = ctx.query
      const viewportWidth = parseInt(width, 10) || 1280
      const viewportHeight = parseInt(height, 10) || 800

      const client = await cdp({port: chromePort})
      const screenshot = await capture({client, url, viewportHeight, viewportWidth})
      ctx.res.setHeader('Content-Type', 'image/png')
      ctx.body = screenshot
    } catch (e) {
      ctx.body = e.stack ? e.stack.toString() : JSON.stringify(e)
      console.error(ctx.body)
    }
  }
}
