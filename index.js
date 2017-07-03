const launchChrome = require('./lib/launch-chrome.js')
const launchServer = require('./lib/server.js')

const CHROME_PORT = 9222
const SERVER_PORT = 3000

launchChrome({ port: CHROME_PORT })
  .then(chrome => {
    launchServer({ port: SERVER_PORT, chromePort: CHROME_PORT })
  })
  .catch(e => {
    console.error('CRITICAL ERR:', e)
    process.exit(1)
  })

process.on('uncaughtException', err => {
  console.error(`UncaughtException: ${err}`)
  process.exit(1)
})
