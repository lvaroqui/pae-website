const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const models  = require('../models')

router.use(bodyParser.json()); 

router.get('/me', function(req, res) {
  if (req.user) {
    res.json(req.user)
  }
  else {
    res.status(403).send('Unauthenticated')
  }
});

module.exports = router;