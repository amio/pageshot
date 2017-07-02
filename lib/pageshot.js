const CDP = require('chrome-remote-interface')

async function capture ({ client, viewportHeight, viewportWidth }) {
  const { Page, Network, Emulation } = client

  await Network.enable()
  await Page.enable()
  await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight})

  return new Promise(function (resolve, reject) {
    Page.loadEventFired(async () => {
      const captured = await Page.captureScreenshot()
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

      // https://github.com/cyrus-and/chrome-remote-interface/issues/127#issuecomment-301421924
      const tab = await CDP.New({port: chromePort, url})
      const client = await CDP({tab})

      await capture({client, viewportHeight, viewportWidth}).then(image => {
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
