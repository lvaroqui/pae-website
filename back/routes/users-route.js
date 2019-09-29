const express = require('express')
const router = express.Router()
const models = require('../models')
const { requireAuth } = require('../helpers')

router.use(requireAuth)
router.get('/me', async (req, res, next) => {
  try {
    let assos
    if (req.user.isAdmin) {
      assos = await models.Asso.findAll()
        .map((asso) => { return { id: asso.id, name: asso.name, hasReservationRight: true } })
    }
    else {
      assos = await req.user.getAssos({
        attributes: ['id', 'name'],
        through: {
          attributes: ['hasReservationRight']
        }
      }).map((asso) => { return { id: asso.id, name: asso.name, hasReservationRight: asso.AssoUser.hasReservationRight } })
    }

    const user = {
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      isMu0x: req.user.isMu0x
    }

    res.json({
      ...user,
      assos
    })
  }
  catch (error) {
    next(error)
  }
})

module.exports = router