const launchChrome = require('./lib/launch-chrome.js')
const launchServer = require('./lib/server.js')

launchChrome({ port: 9222 })
  .then(chrome => {
    launchServer({ port: 3000, chromePort: 9222 })
  })

process.on('uncaughtException', err => {
  console.error(`UncaughtException: ${err}`)
})
