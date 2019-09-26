const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const hosts = require('../config')['hosts']

router.get('/', passport.authenticate('oauth2',  { display: 'popup' }))

router.get('/redirect',
  passport.authenticate('oauth2'),
  (req, res) => {
    res.redirect(hosts.front)
  })

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(hosts.front)
} )

module.exports = router