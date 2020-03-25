/* eslint-disable camelcase */

const convertFactory = (convertLib) => async (req, res) => {
  try {
    const {
      query: {
        amount: src_amount,
        src_currency,
        dest_currency: currency,
        reference_date
      }
    } = req

    const amount = await convertLib(
      src_amount,
      src_currency,
      currency,
      reference_date
    )

    res.status(200).json({ amount, currency })
    return Promise.resolve()
  } catch (error) {
    console.log(`${new Date().toISOString()} ERROR ${error}`)

    switch (error.constructor.name) {
      case 'NotFoundError':
        res.status(404).json({
          statusCode: 404,
          error: error.message
        })
        break
      default:
        res.status(500).json({
          statusCode: 500,
          error: 'Internal Server Error'
        })
    }

    return Promise.reject(error)
  }
}

module.exports = convertFactory
