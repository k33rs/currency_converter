const convertLibFactory = require('../../src/lib/convert')

describe('convert lib', () => {
  it('should return the expected value', async () => {
    const rates = { USD: 1, GBP: 1.5 }
    const redis = { getRate: async (date, currency) => rates[currency] }
    const convert = convertLibFactory(redis)
    const amount = await convert(1, 'USD', 'GBP')

    expect(amount).toBe(1.5)
  })

  it('should throw the expected error', async () => {
    const redis = { getRate: async () => { throw new Error('this is a test') } }
    const convert = convertLibFactory(redis)

    await expect(convert(1, 'USD', 'GPB')).rejects.toThrow('this is a test')
  })
})
