const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy;
const Op = require('sequelize').Op;

const models = require('../models')
const axios = require('axios');
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'

let client = new OAuth2Strategy({
  authorizationURL: 'http://127.0.0.1:8000/oauth/authorize/',
  tokenURL: 'http://127.0.0.1:8000/oauth/token/',
  clientID: '53616d79-206a-6520-7427-61696d652021',
  clientSecret: 'password',
  callbackURL: 'http://localhost:3001/auth/redirect',
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
    // Updating tokens
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    user.save()

    // Updating assos
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
      console.log(error)
      done(error, null)
    }
    done(null, user)
  })
})

client.userProfile = async (accessToken, done) => {
  try {
    const profile = (await axios.get('/user', { headers: {'Authorization': 'Bearer ' + accessToken }})).data
    done(null, profile)
  } catch (error) {
    console.log(error)
    done(error, null)
  }
}

passport.use(client);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findByPk(id).then((user) => {
    done(null, user)
  })
});

module.exports = passport