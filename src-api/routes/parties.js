var express = require('express');
var router = express.Router();

/* GET all parties */
router.get('/', function(req, res, next) {
  res.send('party location');
});

module.exports = router;
