const { NotFoundError } = require('./errors')

let client

class RedisClient {
  static getRedisClient (Redis) {
    if (!client) {
      client = new RedisClient(Redis)
    }
    return client
  }

  constructor (Redis) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: 6379,
      family: 4
    })
  }

  async getRate (time, currency) {
    const rrates = await this.redis.get(time)
    if (!rrates) {
      throw new NotFoundError(`Not Found: ${time}`)
    }

    const rates = JSON.parse(rrates)
    const rate = rates[currency]
    if (!rate) {
      throw new NotFoundError(`Not Found: ${currency}`)
    }

    return rate
  }

  async setRates (rates) {
    const pipeline = this.redis.pipeline()
    rates.forEach(rate => pipeline.set(
      rate.time,
      JSON.stringify(rate.Cube),
      'EX',
      parseInt(process.env.REDIS_TTL || '120')
    ))
    return pipeline.exec()
  }
}

module.exports = RedisClient.getRedisClient
