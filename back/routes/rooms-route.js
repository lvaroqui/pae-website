const express = require('express');
const router = express.Router();
const models  = require('../models')

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      status: 403,
      message: 'Unauthorized'
    })
  }
  next()
}

router.use(requireAuth)
router.get('/', function(req, res) {
  console.log(req.user)
  models.Room.findAll()
  .then((rooms) => {
    res.json(rooms)
  })
});

module.exports = router;