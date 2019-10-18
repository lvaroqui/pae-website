const express = require('express')
const router = express.Router()
const models  = require('../models')
const moment  = require('moment')
const { ErrorHandler } = require('../helpers/error')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { requireAuth } = require('../helpers')

const checkAuthorization = async (req, res, next) => {
  let event
  try {
    event = await models.Event.findByPk(req.params.id)
  } catch (error) {
    return next(new ErrorHandler(400, 'Event could not be find'))
  }

  if (!req.user.isAdmin && req.user.id !== event.UserId) {
    return next(new ErrorHandler(403, 'Forbidden'))
  }
  return next()
}

const checkReservationRight = (user, assoId) => {
  if (user.isAdmin) {
    return true
  }
  user.getAssos({
    where: {id: assoId},
    attributes: ['id'],
    through: {
      attributes: ['hasReservationRight']
    }
  })
    .then(asso => {
      return asso[0].AssoUser ? asso[0].AssoUser.hasReservationRight : false
    })
    .catch(() => {
      return false
    })
}

router.use(requireAuth)
router.get('/:start/:end', (req, res, next) => {
  const start = moment(req.params.start)
  const end = moment(req.params.end).add(1, 'day')
  const userAttributes = req.user.isAdmin ? ['id', 'displayName', 'email'] : ['id']
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
        attributes: userAttributes
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
    .error((err) => {
      return next(err)
    })
})

router.post('/event', (req, res, next) => {
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
        return next(err)
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

    if (req.body.assoId) {
      if (checkReservationRight(req.user, req.body.assoId)) {
        event.setAsso(req.body.assoId, {save: false})
      }
      else {
        return next(ErrorHandler(403, 'Vous ne pouvez pas réserver au nom de cette assos.'))
      }
    }

    event.setRoom(req.body.roomId, {save: false})
    event.setUser(req.user.id, {save: false})
    event.save()
      .catch(err => {
        return next(err)
      })
      .then(() => {
        res.status(200).send()
      })
  }
})

router.patch('/event/:id', checkAuthorization, async (req, res, next) => {
  let event
  try {
    event = await models.Event.findByPk(req.params.id)
  } catch (error) {
    return next(error)
  }

  // Asso reservation
  if (req.body.assoId) {
    if (checkReservationRight(req.user, req.body.assoId)) {
      event.setAsso(req.body.assoId, {save: false})
    }
    else {
      return next(new ErrorHandler(403, 'Vous ne pouvez pas réserver au nom de cette assos.'))
    }
  }

  event.setRoom(req.body.roomId, {save: false})
  event.start = req.body.start,
  event.end = req.body.end,
  event.details = req.body.details

  event.save()
    .catch((err) => {
      return next(err)
    })
    .then(() => {
      res.status(200).send()
    })
})

router.delete('/event/:id', checkAuthorization, (req, res, next) => {
  models.Event.findByPk(req.params.id).then(room => room.destroy())
  res.status(200).send()
})

module.exports = router