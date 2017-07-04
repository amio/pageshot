const chromeDaemon = require('./lib/chrome-daemon.js')
const launchServer = require('./lib/server.js')
const debuglog = require('./lib/debuglog.js')

const CHROME_PORT = 9222
const SERVER_PORT = 3000

chromeDaemon.launch({ port: CHROME_PORT })
  .then(chrome => {
    launchServer({ port: SERVER_PORT, chromePort: CHROME_PORT })
  })
  .catch(e => {
    debuglog('CRITICAL ERR:', e)
  })

process.on('uncaughtException', err => {
  debuglog(`UncaughtException: ${err}`)
  process.exit(1)
})
