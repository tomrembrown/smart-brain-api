const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

require('dotenv').config() // load the environment variables from .env

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const { PORT, DBHOST, DBUSER, DBNAME, DBPASSWORD } = process.env

const db = knex({
  client: 'pg',
  connection: {
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD,
    database: DBNAME,
  },
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res)
})

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
