const chromeLauncher = require('chrome-launcher')

module.exports = function ({port = 9222}) {
  return chromeLauncher.launch({
    port: port,
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars']
  }).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`)
  })
}
