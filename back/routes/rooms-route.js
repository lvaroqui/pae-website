const express = require('express');
const router = express.Router();
const models  = require('../models')
const moment  = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }
  next()
}

const checkAuthorization = (req, res, next) => {
  models.Event.findByPk(req.params.id).then(() => {
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    next()
  })
}

router.use(requireAuth)
router.get('/:monday', function(req, res) {
  const monday = moment.utc(req.params.monday)
  const saturday = moment.utc(req.params.monday).add(6, 'day')
  models.Room.findAll({
    include: [{
      model: models.Event,
      required: false,
      where: {
        start: {
          [Op.between]: [monday.toDate(), saturday.toDate()],
        }
      },
      include: [{
          model: models.User
        }]
    }]
  })
  .then((rooms) => {
    res.json(rooms)
  })
});

router.post('/event', function(req, res) {
  const event = models.Event.build({
    start: req.body.start,
    end: req.body.end,
    details: req.body.details
  })
  event.setRoom(req.body.roomId, {save: false})
  event.setUser(req.user.id, {save: false})
  event.save()
  .catch((err) => {
    res.status(400).send(err.errors)
  })
  .then(() => {
    res.status(200).send()
  })
});

router.patch('/event/:id', checkAuthorization, async function(req, res) {
  const event = await models.Event.findByPk(req.params.id)
  event.setRoom(req.body.roomId, {save: false})
  event.update({
    start: req.body.start,
    end: req.body.end,
    details: req.body.details
  })
  .catch((err) => {
    res.status(400).send(err.errors)
  })
  .then(() => {
    res.status(200).send()
  })
});

router.delete('/event/:id', checkAuthorization, function(req, res) {
  models.Event.findByPk(req.params.id).then(room => room.destroy())
  res.status(200).send()
});

module.exports = router;