const cron = require('node-cron')
const Redis = require('ioredis')

const getRedisClient = require('./src/lib/redis')
const apiFactory = require('./src/services/api')
const parserFactory = require('./src/services/parser')

const redis = getRedisClient(Redis)
const api = apiFactory(redis)
const parse = parserFactory(redis)

const HOST = '0.0.0.0'
const PORT = 8080

parse()
  .then(() => cron.schedule(
    process.env.CRON || '* * * * *',
    parse,
    { timezone: process.env.CRONTZ || 'Europe/London' }
  ))

api.listen(PORT, HOST)

console.log(`${new Date().toISOString()} INFO listening on http://${HOST}:${PORT}`)
