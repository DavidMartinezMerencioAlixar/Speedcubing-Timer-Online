var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var User = require("../models/User");
var Room = require("../models/Room");
var Cube = require("../models/Cube");
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10;

/* GET all users */
router.get('/', function (req, res, next) {
  User.find().exec(function (err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json({ username: user.username });
  });
});

/* GET an user by his username */
router.get("/:username", function (req, res, next) {
  User.findOne({ username: req.params.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else res.status(200).json({ username: user.username });
  });
});

/* POST an user */
router.post('/', [
  body('username', 'Enter a valid username').exists().isLength({ max: 30 }),
  body('password', 'Enter a valid password').exists().isLength({ min: 8, max: 200 })
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => {
    Cube.find().exec(function (err, cubes) {
      if (err) res.status(500).send(err);
      else {
        try {
          cubes.forEach(cube => {
            Room.create({
              cube_name: cube._id.toString(),
              room_code: `${user.username}-local-${cube.name}`,
              competitors_number: 1
            }).then(room => { console.log(room) });
          });

          bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.username, salt, function (err, hash) {
              if (err) return next(err);
              const encryptedUsername = hash;
              return res.status(200).json({ username: encryptedUsername });
            });
          });
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    });
  }).catch(error => res.status(500).send(error));
});

/* Check if an user exists and if the password is correct */
router.post('/login', [
  body('username', 'Enter a valid username').exists().isLength({ max: 30 }),
  body('password', 'Enter a valid password').exists().isLength({ min: 8, max: 200 })
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) return res.status(500).send(err);
    if (user != null) {
      bcrypt.compare(req.body.password, user.password, function (err2, res2) {
        if (err2) return res.status(500).send(err2);
        if (res2) {
          bcrypt.genSalt(SALT_WORK_FACTOR, function (err3, salt) {
            if (err3) return next(err3);
            bcrypt.hash(user.username, salt, function (err4, hash) {
              if (err4) return next(err4);
              return res.status(200).json({ username: hash });
            });
          });
        } else {
          return res.status(204).send();
        }
      });
    } else {
      return res.status(204).send();
    }
  });
});

/* PUT an user */
router.put("/", function (req, res, next) {
  User.findOne({ username: req.query.oldUsername }).exec(function (err, user) {
    if (err) return res.status(500).send(err);
    if (user != null) {
      bcrypt.compare(req.body.oldPassword, user.password, function (err2, res2) {
        if (err2) return res.status(500).send(err2);
        if (res2) {
          bcrypt.hash(req.body.newPassword, SALT_WORK_FACTOR, function (err3, hash) {
            if (err3) return next(err3);
            const updateData = req.body.newPassword === "" ? { username: req.query.newUsername } : { username: req.query.newUsername, password: hash };

            User.updateOne({ username: req.query.oldUsername },
              updateData, function (err3, res3) {
                if (err3) return next(err3);
                bcrypt.hash(user.username, SALT_WORK_FACTOR, function (err4, hash) {
                  if (err4) return next(err4);
                  return res.status(200).json({ username: hash });
                });
              });
          });
        } else {
          return res.status(204).send();
        }
      });
    } else {
      return res.status(204).send();
    }
  });
});

/* DELETE an user */
router.delete("/:username", function (req, res, next) {
  User.findOneAndRemove({ username: req.params.username }, function (err, user) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

module.exports = router;
