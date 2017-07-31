const express = require('express');
const router = express.Router();
const User = require('../models/mongo/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.post('/sinup', (req, res, next) => {
  const user = {
    name: req.body.name,
    phoneNumber : req. body.phoneNumber,
    password: req.body.pssword
  }
  User.createANewUser()
  (async () => {
  })()
    .then(r => {
      res.data = r;
      response(req, res);
    })
    .catch(e => {
      res.err = e;
      response(req, res);
    });

});

router.post('/login', (req, res, next) => {

});

module.exports = router;
