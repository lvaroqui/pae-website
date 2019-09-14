const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var models  = require('../models')

router.use(bodyParser.json()); 

router.get('/', function(req, res) {
  models.Room.findAll()
  .then((rooms) => {
    res.json(rooms)
  })
});

module.exports = router;