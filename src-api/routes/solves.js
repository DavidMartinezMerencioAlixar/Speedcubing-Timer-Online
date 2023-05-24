var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Solve = require("../models/Solve");

/* GET all solves */
router.get('/', function(req, res, next) {
  res.send('solve location');
});

/* POST a solve */
router.post('/', [
  body('time', 'Enter a valid time').exists(),
  body('scramble', 'Enter a valid scramble').exists(),
  body('video', 'Enter a valid scramble')
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const video = req.body.video !== undefined ? req.body.video : "";
  Solve.create({
    time: req.body.time,
    scramble: req.body.scramble,
    date: Date.now(),
    video: video
  }).then(solve => {
    return res.status(200).json(solve);
  }).catch(error => res.status(500).send(error));
});

module.exports = router;
