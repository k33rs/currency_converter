/* istanbul ignore file */
function getReq ({
  headers = {},
  params = {},
  query = {},
  originalUrl = ''
} = {}) {
  return {
    headers,
    params,
    query,
    originalUrl
  }
}

function getRes () {
  return {
    status (code) {
      const self = this
      self.statusCode = code
      return {
        json (json) {
          self.body = json
        }
      }
    }
  }
}

async function executeMiddlewaresChain ({ chain, req = getReq(), res = getRes() }) {
  for (let i = 0; i < chain.length; i += 1) {
    await chain[i](req, res)
  }

  return Promise.resolve(res)
}

module.exports = {
  getReq,
  getRes,
  executeMiddlewaresChain
}
