const getRedisClient = require('../../src/lib/redis')

describe('redis lib', () => {
  describe('getRate', () => {
    it('should throw if no rate is found on the given date', async () => {
      class Redis {
        constructor () {
          this.db = {}
        }

        async get (time) {
          return this.db[time]
        }

        pipeline () {
          return {
            set: (time, rates) => {
              this.db[time] = rates
            },
            exec: () => Promise.resolve()
          }
        }
      }
      const redis = getRedisClient(Redis)

      await expect(redis.getRate('now', 'USD')).rejects.toThrow('Not Found: now')
    })
  })

  describe('setRates / getRate', () => {
    it('should write to db / read from db', async () => {
      const redis = getRedisClient()
      await redis.setRates([
        {
          time: 'today',
          Cube: {
            USD: '1.08',
            GBP: '0.92'
          }
        },
        {
          time: 'yesterday',
          Cube: {
            USD: '1.09',
            GBP: '0.91'
          }
        }
      ])

      const tUSD = await redis.getRate('today', 'USD')
      const tGBP = await redis.getRate('today', 'GBP')
      const yUSD = await redis.getRate('yesterday', 'USD')
      const yGBP = await redis.getRate('yesterday', 'GBP')

      expect(tUSD).toBe('1.08')
      expect(tGBP).toBe('0.92')
      expect(yUSD).toEqual('1.09')
      expect(yGBP).toEqual('0.91')
    })
  })

  describe('getRate', () => {
    it('should throw if no rate is found for the given currency', async () => {
      const redis = getRedisClient()

      await expect(redis.getRate('today', 'EUR')).rejects.toThrow('Not Found: EUR')
    })
  })
})
