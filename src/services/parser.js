const axios = require('axios')

const { getRatesFactory, compactRates } = require('../lib/rates')

const getRates = getRatesFactory(axios)

const parserFactory = (redis) => async () => {
  try {
    const rates = await getRates()
    const crates = compactRates(rates)

    await redis.setRates(crates)

    console.log(`${new Date().toISOString()} INFO write success`)
  } catch (error) {
    console.log(`${new Date().toISOString()} ERROR ${error}`)
  }
}

module.exports = parserFactory
