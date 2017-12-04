const launchServer = require('./lib/server.js')

const SERVER_PORT = 3000

launchServer({ port: SERVER_PORT })

process.on('uncaughtException', err => {
  console.error(`UncaughtException: ${err}`)
  process.exit(1)
})
