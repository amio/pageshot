const Koa = require('koa')
const Nightmare = require('nightmare')

const app = new Koa()

const serveIntroHTML = async (ctx, next) => {
  if (!ctx.query.url) {
    ctx.body = require('fs').readFileSync('./intro.html', 'utf-8')
  } else {
    await next()
  }
}

const screenshotService = async ctx => {
  if (!ctx.query.url) return

  const { url, height, width } = ctx.query
  const result = await Nightmare({gotoTimeout: 6000})
    .viewport(parseInt(width) || 960, parseInt(height) || 640)
    .goto(url)
    .screenshot()
    .end()

  ctx.res.setHeader('Content-Type', 'image/png')
  ctx.body = result
}

app.use(serveIntroHTML)
app.use(screenshotService)
app.listen(3002)
