const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy
const models = require('../models')
const axios = require('axios')
const config = require('./index')
const Op = require('sequelize').Op

axios.defaults.baseURL = `${ config.hosts.api }/api/v1`

let client = new OAuth2Strategy({
  authorizationURL: `${ config.hosts.api }/oauth/authorize/`,
  tokenURL: `${ config.hosts.api }/oauth/token/`,
  clientID: config.api.clientID,
  clientSecret: config.api.clientSecret,
  callbackURL: `${ config.hosts.back }/auth/redirect`,
  scope: ['user-get-info', 'user-get-assos']
},
(accessToken, refreshToken, profile, done) => {
  models.User.findOrCreate({
    where: { id: profile.id },
    defaults: {
      displayName: `${ profile.firstname } ${ profile.lastname }`,
      email: profile.email,
      accessToken,
      refreshToken
    }})
    .then(async ([user, created]) => {
      // Updating API tokens
      user.accessToken = accessToken
      user.refreshToken = refreshToken
      user.save()

      // Updating Assos
      try {
        const assosUser = (await axios.get('/user/assos', { headers: {'Authorization': 'Bearer ' + accessToken }})).data
        const assosUserIds = assosUser.map(asso => asso.id)
        const assosCorresponding = await models.Asso.findAll({
          where: {
            id: {
              [Op.in]: assosUserIds
            }
          }
        })
        user.addAssos(assosCorresponding)
      } catch (error) {
        done(error, null)
      }

      done(null, user)
    })
})

client.userProfile = async (accessToken, done) => {
  try {
    const profile = (await axios.get('/user', { headers: { 'Authorization': 'Bearer ' + accessToken }})).data
    done(null, profile)
  } catch (error) {
    console.log(error)
    done(error, null)
  }
}

passport.use(client)

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  models.User.findByPk(id).then((user) => {
    done(null, user)
  })
})

module.exports = passport