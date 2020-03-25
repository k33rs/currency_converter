const parser = require('xml2json')

const getRatesFactory = (client) => async () => {
  const response = await client.get(
    process.env.RATES_API || 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'
  )

  const { data } = response
  const dataStr = parser.toJson(data)
  const dataJson = JSON.parse(dataStr)

  const {
    'gesmes:Envelope': {
      Cube: {
        Cube: rates
      }
    }
  } = dataJson

  return rates
}

const compactRates = (rates) => {
  return rates.map(rate => {
    const kvpairs = rate.Cube.map(elem => ({ [elem.currency]: elem.rate }))

    rate.Cube = { [process.env.REF_CURRENCY || 'EUR']: '1' }
    const [rate1, ...rate2toN] = kvpairs
    Object.assign(rate.Cube, rate1, ...rate2toN)

    return rate
  })
}

module.exports = { getRatesFactory, compactRates }
