const qs = require('querystring')
const Url = require('url')
const micro = require('micro')
const snarkdown = require('snarkdown')
const Nightmare = require('nightmare')

const helpHTML = snarkdown(require('fs').readFileSync('./README.md', 'utf-8'))

const screenshot = async (req, res) => {
  const query = qs.parse(Url.parse(req.url).query)
  const { url, height = 640, width = 960 } = query

  if (!url) return helpHTML

  return Nightmare()
    .viewport(parseInt(width), parseInt(height))
    .goto(url)
    .screenshot()
    .end(result => {
      res.setHeader('Content-Type', 'image/png')
      return result
    }, error => {
      console.error(error)
      return error
    })
}

micro(screenshot).listen(3000)
