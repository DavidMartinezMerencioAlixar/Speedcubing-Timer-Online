var express = require('express');
var router = express.Router();

/* GET all solves */
router.get('/', function(req, res, next) {
  res.send('solve location');
});

module.exports = router;
