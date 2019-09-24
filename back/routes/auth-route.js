const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/', passport.authenticate('oauth2',  { display: 'popup' }))

router.get('/redirect',
  passport.authenticate('oauth2'),
  (req, res) => {
    res.redirect('http://localhost:3000/')
  })

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('http://localhost:3000/')
} )

module.exports = router