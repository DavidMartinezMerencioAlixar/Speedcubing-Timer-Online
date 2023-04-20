var express = require('express');
var router = express.Router();

/* GET all rooms */
router.get('/', function(req, res, next) {
  res.send('room location');
});

module.exports = router;
