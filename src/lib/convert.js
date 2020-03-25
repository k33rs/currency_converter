const BigNumber = require('bignumber.js')

const convertLibFactory = (redis) => async (
  amount,
  srcCurrency,
  dstCurrency,
  date = new Date().toISOString().replace(/T.*Z/, '')
) => {
  const srcRate = await redis.getRate(date, srcCurrency)
  const dstRate = await redis.getRate(date, dstCurrency)

  const amountBN = BigNumber(amount)
    .div(srcRate)
    .times(dstRate)
    .dp(2, BigNumber.ROUND_HALF_DOWN)

  return amountBN.toNumber()
}

module.exports = convertLibFactory
