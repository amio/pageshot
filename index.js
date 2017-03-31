const qs = require('querystring')
const Url = require('url')
const micro = require('micro')
const Nightmare = require('nightmare')

const screenshot = async (req, res) => {
  const query = qs.parse(Url.parse(req.url).query)
  const { url, height = 640, width = 960 } = query

  if (!url) return require('fs').readFileSync('./intro.html', 'utf-8')

  return Nightmare({gotoTimeout: 6000})
    .viewport(parseInt(width), parseInt(height))
    .goto(url)
    .screenshot()
    .end(result => {
      res.setHeader('Content-Type', 'image/png')
      return result
    })
}

micro(screenshot).listen(3001)
