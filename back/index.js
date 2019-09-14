const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

const roomsRouter = require('./routes/rooms');

// const passport = require('passport')
// const OAuth2Strategy = require('passport-oauth2').Strategy;passport.use(new OAuth2Strategy({
//   authorizationURL: 'http://localhost:8000/oauth/authorize',
//   tokenURL: 'http://localhost:8000/oauth/token',
//   clientID: '53616d79-206a-6520-7427-61696d652021',
//   clientSecret: 'password',
//   callbackURL: 'http://localhost:3000/'
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use('/rooms', roomsRouter);

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
