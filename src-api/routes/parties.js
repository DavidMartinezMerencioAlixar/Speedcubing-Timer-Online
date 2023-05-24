var express = require('express');
var app = express();
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Party = require("../models/Party");
var User = require("../models/User");

/* GET all parties */
router.get('/', function(req, res, next) {
  res.send('party location');
});

/* POST a party */
router.post('/', [
  body('time', 'Enter a valid time').exists(),
  body('scramble', 'Enter a valid scramble').exists(),
  body('video', 'Enter a valid video'),
  body('username', 'Enter a valid username').exists(),
  body('room', 'Enter a valid room').exists()
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else {
      const URL = "http://localhost:5000/solves";
      const video = req.body.video !== undefined ? req.body.video : "";
      
      const response = fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ time: req.body.time, scramble: req.body.scramble, video })
      }).then(response => {
        if (response.status === 200) {
          response.json().then(solve => {
            const URL = `http://localhost:5000/rooms/${req.body.room}`;

            const response = fetch (URL,
            ).then(response => {
              if (response.status === 200) {
                response.json().then(room => {
                  console.log(user._id.toString(), solve._id.toString());
                  Party.create({
                    data: {
                      user_id: user._id.toString(),
                      solve_id: solve._id.toString()
                    },
                    room_id: room._id.toString()
                  }).then(party => {
                    return res.status(200).send(party);
                  }).catch(error => res.status(500).send(error));
                });
              }
            });
          });
        }
      }).catch(error => {
        res.status(500).send(error);
      });
    }
  });
});

module.exports = router;
