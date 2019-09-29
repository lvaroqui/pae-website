const express = require('express')
const router = express.Router()
const models  = require('../models')
const moment  = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { requireAuth } = require('../utils')

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
router.get('/:start/:end', function(req, res) {
  const start = moment(req.params.start)
  const end = moment(req.params.end).add(1, 'day')
  models.Room.findAll({
    include: [{
      model: models.Event,
      required: false,
      attributes: ['id', 'start', 'end', 'details'],
      where: {
        start: {
          [Op.between]: [start.toDate(), end.toDate()],
        }
      },
      include: [{
        model: models.User,
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: models.Asso,
        attributes: ['id', 'name']
      }
      ]
    }]
  })
    .then((rooms) => {
      res.json(rooms)
    })
})

router.post('/event', function(req, res) {
  // Recurring event request from an Admin
  if (req.user.isAdmin && req.body.until) {
    let start = moment(req.body.start)
    let end = moment(req.body.end)
    const until = moment(req.body.until)
    const events = []

    // Building all events
    while (start.isSameOrBefore(until, 'day')) {
      const event = models.Event.build({
        start: start.toDate(),
        end: end.toDate(),
        details: req.body.details
      })
      event.setAsso(req.body.assoId, {save: false})
      event.setRoom(req.body.roomId, {save: false})
      event.setUser(req.user.id, {save: false})

      events.push(event)

      start.add(7, 'day')
      end.add(7, 'day')
    }

    // Trying to insert events in one transaction
    models.sequelize.transaction((t) => {
      return Promise.all(
        events.map(e => e.save({ transaction: t }))
      )
    })
      .catch(err => {
        res.status(400).send(err.errors)
      })
      .then(result => {
        res.status(200).send()
      })
  }
  // Standalone request
  else {
    const event = models.Event.build({
      start: req.body.start,
      end: req.body.end,
      details: req.body.details
    })
    event.setAsso(req.body.assoId, {save: false})
    event.setRoom(req.body.roomId, {save: false})
    event.setUser(req.user.id, {save: false})
    event.save()
      .catch((err) => {
        res.status(400).send(err.errors)
      })
      .then(() => {
        res.status(200).send()
      })
  }
})

router.patch('/event/:id', checkAuthorization, async function(req, res) {
  const event = await models.Event.findByPk(req.params.id)

  event.setAsso(req.body.assoId, {save: false})
  event.setRoom(req.body.roomId, {save: false})
  event.start = req.body.start,
  event.end = req.body.end,
  event.details = req.body.details

  event.save()
    .catch((err) => {
      res.status(400).send(err.errors)
    })
    .then(() => {
      res.status(200).send()
    })
})

router.delete('/event/:id', checkAuthorization, function(req, res) {
  models.Event.findByPk(req.params.id).then(room => room.destroy())
  res.status(200).send()
})

module.exports = router