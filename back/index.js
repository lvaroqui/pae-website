const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const assosRouter = require('./routes/assos-routes')
const roomsRouter = require('./routes/rooms-route')
const usersRouter = require('./routes/users-route')
const authRouter = require('./routes/auth-route')

const passport = require('./config/passport')

const session = require('./config')['session']
const { handleError } = require('./helpers/error')
const config = require('./config')

var corsOptions = {
  origin: config.hosts.front,
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  keys: [session.cookieKey]}
))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/api/assos', assosRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/users', usersRouter)

app.use((err, req, res, next) => {
  handleError(err, res)
})

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
