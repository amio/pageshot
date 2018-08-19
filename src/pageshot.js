const assert = require('assert')
const { getBrowser } = require('./setup.js')

module.exports = async function pageshot (ctx) {
  const { response } = ctx
  const { url, height, width, dpr, full } = ctx.query

  if (typeof url !== 'string') {
    response.code = 400
    response.body = 'URL is required.'
    return
  }

  const fullPage = !!full
  const viewport = {
    width: parseInt(width, 10) || 960,
    height: parseInt(height, 10) || 640,
    deviceScaleFactor: parseInt(dpr, 10) || 2
  }

  console.time(url)
  try {
    const page = await (await getBrowser()).newPage()
    await page.setViewport(viewport)
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
