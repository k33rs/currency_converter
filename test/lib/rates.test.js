const { getRatesFactory, compactRates } = require('../../src/lib/rates')

describe('rates lib', () => {
  const client = {
    get: async () => ({
      data: '<?xml version="1.0" encoding="UTF-8"?>' +
      '<gesmes:Envelope>' +
        '<Cube>' +
        '<Cube time="today">' +
          '<Cube currency="USD" rate="1.08"/>' +
          '<Cube currency="GBP" rate="0.92"/>' +
        '</Cube>' +
        '<Cube time="yesterday">' +
          '<Cube currency="USD" rate="1.09"/>' +
          '<Cube currency="GBP" rate="0.91"/>' +
        '</Cube>' +
        '</Cube>' +
      '</gesmes:Envelope>'
    })
  }
  const getRates = getRatesFactory(client)

  describe('getRates', () => {
    it('should return the expected rates as JSON', async () => {
      const rates = await getRates()

      expect(rates).toEqual([
        {
          time: 'today',
          Cube: [
            { currency: 'USD', rate: '1.08' },
            { currency: 'GBP', rate: '0.92' }
          ]
        },
        {
          time: 'yesterday',
          Cube: [
            { currency: 'USD', rate: '1.09' },
            { currency: 'GBP', rate: '0.91' }
          ]
        }
      ])
    })
  })

  describe('compactRates', () => {
    it('should compact each rate JSON structure and add reference currency', async () => {
      const rates = await getRates()
      const compact = compactRates(rates)

      expect(compact).toEqual([
        {
          time: 'today',
          Cube: {
            EUR: '1',
            USD: '1.08',
            GBP: '0.92'
          }
        },
        {
          time: 'yesterday',
          Cube: {
            EUR: '1',
            USD: '1.09',
            GBP: '0.91'
          }
        }
      ])
    })
  })
})
