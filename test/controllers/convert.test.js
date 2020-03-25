const convertFactory = require('../../src/controllers/convert')
const { NotFoundError } = require('../../src/lib/errors')
const { executeMiddlewaresChain, getReq, getRes } = require('./express')

describe('convert controller', () => {
  const req = getReq({
    query: {
      amount: 1,
      src_currency: 'USD',
      dest_currency: 'GBP'
    }
  })

  it('should return 200', async () => {
    const convert = convertFactory(val => val)
    const res = await executeMiddlewaresChain({ req, chain: [convert] })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({ amount: 1, currency: 'GBP' })
  })

  it('should return 404', async () => {
    const convert = convertFactory(() => { throw new NotFoundError('Not Found: test') })

    const res = getRes()
    await expect(executeMiddlewaresChain({
      req, res, chain: [convert]
    })).rejects.toThrow('Not Found: test')

    expect(res.statusCode).toEqual(404)
    expect(res.body).toEqual({
      statusCode: 404,
      error: 'Not Found: test'
    })
  })

  it('should return 500', async () => {
    const convert = convertFactory(() => { throw new Error('this is a test') })

    const res = getRes()
    await expect(executeMiddlewaresChain({
      req, res, chain: [convert]
    })).rejects.toThrow('this is a test')

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual({
      statusCode: 500,
      error: 'Internal Server Error'
    })
  })
})
