var express = require('express');
var router = express.Router();
//var app = require('../app');
//var expressWs = require('express-ws')(app);

router.get('/', function(req, res, next) {
  res.render('index');
});

/* expressWs.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    ws.send(msg);
  });
}); */

module.exports = router;
//module.exports = expressWs;
