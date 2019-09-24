const express = require('express')
const router = express.Router()
const models  = require('../models')

const { requireAuth, requireAdmin } = require('../utils')

router.use(requireAuth)
router.use(requireAdmin)

router.get('/', async function(req, res) {
  const assos = await models.Asso.findAll()
  res.json(assos)
})

module.exports = router