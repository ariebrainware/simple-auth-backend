const express = require('express')
const router = express.Router()

const controller = require('./controller')

/* GET home page. */
router.get('/', function(req, res) {
  res.status(200).send({ title: 'Simple authentication' })
})
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout/:token', controller.logout)
router.post('/logout', controller.logout)

module.exports = router
