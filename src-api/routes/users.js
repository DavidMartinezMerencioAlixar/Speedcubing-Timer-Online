var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var User = require("../models/User");
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 4;

/* GET all users */
router.get('/', function (req, res, next) {
  User.find().exec(function (err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json({ username: user.username });
  });
});

// GET an user by his username
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
  let encryptedUsername;
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.username, salt, function (err, hash) {
        if (err) return next(err);
        encryptedUsername = hash;
        console.log(encryptedUsername);
        res.json({ username: encryptedUsername });
      });
    });
  }
  ).catch(error => res.status(204).send());
});

/* PUT an user */
router.put("/:username", function (req, res, next) {
  User.findOneAndUpdate(
    { username: req.params.username },
    req.body,
    function (err, user) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

/* DELETE an user */
router.delete("/:username", function (req, res, next) {
  User.findOneAndDelete({ username: req.params.username }, function (err, user) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

module.exports = router;
