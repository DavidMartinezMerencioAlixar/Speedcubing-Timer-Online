var express = require('express');
var app = express();
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Party = require("../models/Party");
var User = require("../models/User");
var Room = require("../models/Room");

/* GET actual party */
router.get('/actual', function(req, res, next) {
  // console.log("room", getRoom(req.query.room_code));
  Room.findOne({ room_code: req.query.room_code }).exec(function (err, room) {
    if (err) return res.status(500).send(err)
    else if (room) {
      User.findOne({ username: req.query.username }).exec(function (err, user) {
        if (err) return res.status(500).send(err)
        else if (user) {
          Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }
          ).populate("solve_ids").exec(function (err, party) {
            if (err) res.status(500).send(err);
            else if (party) return res.status(200).send(party);
            else return res.status(204).send();
          });
        } else return res.status(204).send();
      });
    } else return res.status(204).send();
  });
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

  // Searches the user by his username
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else {
      const URL = "http://localhost:5000/solves";

      const video = req.body.video !== undefined ? req.body.video : "";
      
      // Posts the solve
      const response = fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ time: req.body.time, scramble: req.body.scramble, video })
      }).then(response => {
        if (response.status === 200) {
          // Gets the room
          response.json().then(solve => {
            const URL = `http://localhost:5000/rooms/${req.body.room}`;

            const response = fetch (URL,
            ).then(response => {
              if (response.status === 200) {
                response.json().then(room => {
                  // If the party (user + room) exists, adds the solve. If not, creates a new one and with that first solve
                  Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }).exec(function (err, party) {
                    if (err) res.status(500).send(err);
                    else if (party !== null) {
                      // Adds the solve to the party solves list
                      party.solve_ids.push(solve._id);
                      party.save();
                      // console.log(party.depopulate("solve_ids[0]"));
                      party.populate("solve_ids", function(err, last_solve) {
                        const solvesAmount = last_solve.solve_ids.length;
                        const lastSolve = last_solve.solve_ids[solvesAmount-1];
                        return res.status(200).json({ lastSolve, solvesAmount });
                      });
                      
                    } else {
                      // Creates the party with that first solve
                      Party.create({
                        data: {
                          user_id: user._id.toString(),
                          room_id: room._id.toString()
                        },
                        solve_ids: [solve._id.toString()]
                      }).then(party => {
                        party.populate("solve_ids", function(err, last_solve) {
                          const solvesAmount = last_solve.solve_ids.length;
                          const lastSolve = last_solve.solve_ids[solvesAmount-1];
                          return res.status(200).json({ lastSolve, solvesAmount });
                        });
                      }).catch(error => res.status(500).send(error)); 
                    }
                  });
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
