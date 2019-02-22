const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.user

const controller = {
  register: (req, res) => {
    const { username, password, email } = req.body
    if (username && password && email) {
      User
        .findOne({ where: {username: username}})
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
          } else res.status(400).send({ message: 'User already exist!'})
        })
    } else res.status(400).send({ message: 'Make sure username, password, and email field not empty'})
  },
}

module.exports = controller
