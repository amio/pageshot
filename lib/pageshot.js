const puppeteer = require('puppeteer')
const assert = require('assert')

const browser = puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})

module.exports = async function pageshot (ctx) {
  const { response } = ctx
  const { url, height, width, full } = ctx.query

  assert(typeof url === 'string', 'URL is required.')

  const viewportSize = {
    width: parseInt(width, 10) || 1280,
    height: parseInt(height, 10) || 800
  }
  const fullPage = !!full

  console.time(url)
  try {
    const page = await (await browser).newPage()
    await page.setViewport(viewportSize)
    await page.goto(url, {timeout: 10000})
    response.body = await page.screenshot({fullPage})
    response.type = 'image/png'
    page.close()
  } catch (e) {
    response.body = 'PAGESHOT FAILED: ' + e.message
    response.code = 400
    console.error('SHOT_ERROR', e.message)
  }
  console.timeEnd(url)
}
