var http = require('http')
var ecstatic = require('ecstatic')
var HttpHashRouter = require('http-hash-router')
var router = HttpHashRouter()
var fs = require('fs')

var response = require('palmettoflow-event').response
var responseError = require('palmettoflow-event').responseError

var sendError = require('send-data/error')
var sendJson = require('send-data/json')
var sendHtml = require('send-data/html')

var jsonBody = require('body/json')

// currently sandbox only works for couchdb - in future
// it would be nice to work for any adapter...
var palmetto = require('@twilson63/palmetto-couchdb')

router.set('/api', {
  POST: function (req, res) {
    jsonBody(req, res, function (err, body) {
      if (err) { return sendError(req, res, { body: err.message })}
      var ee = palmetto(body.palmetto)
      var outOfTime = false
      var to = setTimeout(function () {
        outOfTime = true
        sendError(req, res, responseError(body.newEvent, { message: 'Time out'}))
      }, 3000)
      ee.on(body.newEvent.from, function (event) {
        if (!outOfTime) {
          clearTimeout(to)
          sendJson(req, res, event)
        }
      })
      ee.emit('send', body.newEvent)
    })
  }
})

router.set('/*', ecstatic('www'))

var index = fs.readFileSync('./www/index.html', 'utf-8')

router.set('/', function (req, res) {
  sendHtml(req, res, index)
})

var server = http.createServer(function (req, res) {
  router(req, res, {}, function (err) {
    sendError(req, res, { body: err.message })
  })
})

server.listen(process.env.PORT || 3000)