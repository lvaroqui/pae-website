const express = require('express')
const router = express.Router()
const models  = require('../models')

router.get('/', (req, res, next) => {
  models.Asso.findAll({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']]
  })
    .then((assos) => {
      res.json(assos)
    })
    .error((err) => {
      return next(err)
    })
})

module.exports = router