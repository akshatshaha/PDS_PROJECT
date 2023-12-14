const jwt = require('jsonwebtoken')

const authUser = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(401).send('Error')
  }

  try {
    console.log('must decode')
    const payload = jwt.verify(token, 'secret')
    if (payload === null || typeof payload === 'string') return res.sendStatus(403)
    console.log(payload)
    req.customer = payload
    console.log('decoded')
    next()
  } catch (e) {
    console.log(e)
    return res.sendStatus(403)
  }
}

module.exports = { authUser }