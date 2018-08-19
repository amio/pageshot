const puppeteer = require('puppeteer')

const isBrowserAvailable = async browser => {
  try {
    await browser.version()
  } catch (e) {
    console.error(e)
    return false
  }
  return true
}

exports.getBrowser = (() => {
  let browser
  let launching
  return async () => {
    let unlock
    // eslint-disable-next-line no-unused-expressions
    launching && launching.then && (await launching)
    // eslint-disable-next-line no-return-assign
    launching = new Promise(r => (unlock = r))
    if (!browser || !(await isBrowserAvailable(browser))) {
      browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--headless', '--disable-gpu', '-—disable-dev-tools'],
        dumpio: true,
        devtools: false
      })
      console.log(`launch done: ${await browser.version()}`)
    }
    unlock()
    return browser
  }
})()
