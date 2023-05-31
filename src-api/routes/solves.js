var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Solve = require("../models/Solve");
var Party = require("../models/Party");
var Room = require("../models/Room");
var User = require("../models/User");

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

/* DELETE a solve */
router.delete('/', function (req, res, next) {
  // Buscar user por username y obtener el id
  // Buscar room por room_code y obtener el id
  // Buscar la party por username y room_code
  // Obtener la posición del solve de a partir de :solvePosition
  // Obtener el id del solve y elminarlo del array
  // Eliminar el solve por su id
  Room.findOne({ room_code: req.query.room_code }).exec(function (err, room) {
    if (err) res.status(500).send(err)
    else if (room) {
      User.findOne({ username: req.query.username }).exec(function (err, user) {
        if (err) return res.status(500).send(err)
        else if (user) {
          Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }
          ).populate("solve_ids").exec(function (err, party) {
            if (err) res.status(500).send(err);
            else if (party) {
              const idToRemove = party.solve_ids[req.query.solve_position]._id;

              party.solve_ids.splice(req.query.solve_position, 1);

              Solve.findByIdAndRemove(idToRemove, function (err, solve) {
                if (err) res.status(500).send(err);
                else res.status(200).json(solve);
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
