const express = require('express')
const { errors } = require('celebrate')

const convertFactory = require('../controllers/convert')
const validate = require('../controllers/validate')
const convertLibFactory = require('../lib/convert')

const apiFactory = (redis) => {
  const convertLib = convertLibFactory(redis)
  const convert = convertFactory(convertLib)

  const router = express.Router()
  router.get('/convert', validate, convert)
  router.use(errors())

  const api = express()
  api.use('/', router)

  return api
}

module.exports = apiFactory
