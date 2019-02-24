const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.user

const controller = {
  register: (req, res) => {
    const { username, password, email } = req.body
    if (username && password && email) {
      User
        .findOne({ where: { username: username } })
        .then(user => {
          if (!user) {
            const salts = 10
            bcrypt
              .hash(password, salts)
              .then(hash => {
                return {
                  username, password: hash,
                  email, createdAt: new Date(), updatedAt: new Date(),
                }
              })
              .then(user => {
                User
                  .create(user)
                  .then(repsonse => res.status(200).send({ message: ' User registration success', repsonse }))
                  .catch(err => res.status(500).send(err))
              })
              .catch(err => res.status(500).send(err))
          } else res.status(400).send({ message: 'User already exist!' })
        })
    } else res.status(400).send({ message: 'Make sure username, password, and email field not empty' })
  },
  login: (req, res) => {
    const { username, password } = req.body
    if (username && password) {
      User
        .findOne({ where: { username: username } })
        .then(user => {
          if (user) {
            User.update({
              online: 'true',
              updatedAt: new Date(),
            }, { where: { username: username } })
              .then(() => {
                bcrypt
                  .compare(password, user.password)
                  .then(response => {
                    if (response) {
                      const token = jwt.sign({ username }, process.env.SECRETKEY, { expiresIn: '8h' })
                      res.status(200).send({ message: 'Login success', token })
                    }
                  })
                  .catch(err => res.status(500).send(err))
              })
          } else res.status(404).send({ message: 'User not exist!, make sure to register first' })
        })
        .catch(err => res.status(500).send(err))
    } else res.status(500).send({ message: 'Make sure username and password field not empty!' })
  },
  logout: (req, res) => {
    const { token } = req.params
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRETKEY)
      if (decoded.username) {
        User
          .findOne({ where: { username: decoded.username } })
          .then(() => {
            User
              .update({ online: 'false' }, { where: { username: decoded.username } })
              .then(() => res.status(200).send({ message: 'Logout success!' }))
              .catch(err => res.status(500).send(err))
          })
          .catch(err => res.status(500).send(err))
      } else res.status(400).send({ message: 'Token is not valid!'})
    } else res.status(400).send({ message: 'Please provide the token!'})
  },
}

module.exports = controller
