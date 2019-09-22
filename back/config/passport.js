const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy;

const models = require('../models')
const request = require('request');

let client = new OAuth2Strategy({
  authorizationURL: 'http://127.0.0.1:8000/oauth/authorize/',
  tokenURL: 'http://127.0.0.1:8000/oauth/token/',
  clientID: '53616d79-206a-6520-7427-61696d652021',
  clientSecret: 'password',
  callbackURL: 'http://localhost:3001/auth/redirect',
  scope: 'user-get-info'
},
(accessToken, refreshToken, profile, done) => {
  console.log(profile)
  models.User.findOrCreate({ 
    where: { id: profile.id }, 
    defaults: {
      displayName: `${ profile.firstname } ${ profile.lastname }`,
      email: profile.email
    }})
  .then(([user, created]) => {
    done(null, user)
  })
})

client.userProfile = (accessToken, done) => {
  request({
    url: 'http://127.0.0.1:8000/api/v1/user',
    auth: {
      'bearer': accessToken
    }
  }, (err, res) => {
    done(null, JSON.parse(res.body))
  });  
};


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