var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Solve = require("../models/Solve");
var Party = require("../models/Party");

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

/* DELETE a solve */
// router.delete("/:id", function (req, res, next) {
//   Party.findOne({ solve_ids: { $eq: req.params.id } }).exec(function(party) {
//     console.log(party);
//     Solve.findByIdAndRemove(req.params.id, function (err, solve) {
//       if (err) return res.status(500).send(err);
//       else return res.sendStatus(200).json(solve);
//     });
//   });
// });

module.exports = router;
