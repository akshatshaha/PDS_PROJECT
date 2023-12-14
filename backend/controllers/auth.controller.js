const { getCustomerById, createCustomer, registerCustomerAddress, registerAddress } = require('../customerModel')
const jwt = require('jsonwebtoken')
const {tx} = require('../utils/tx')

const login = async (req, res) => {
  try {
    const customer = await getCustomerById(req.body.custID)

    if (customer.passcode !== req.body.passcode) {
      return res.json({ error: 'Incorrect password' })
    }

    jwt.sign({ id: customer.custid }, 'secret', (err, token) => {
      if (err) {
        return res.json({ error: 'Error signing token' })
      }
      console.log(token)
      return res.json({ token, name: customer.cfname })
    })
  } catch (e) {
    res.json({ error: e.message })
  }
}

const signup = async (req, res) => {
  try {
    await tx(async client => {
      const customer = await createCustomer(client, req.body)
      console.log('created customer: ', customer)
      const address  = await registerAddress(client, req.body)
      console.log('created address: ', address)
      await registerCustomerAddress(client, customer.custid, address.addressid, req.body.isBilling)
      console.log('created customer address')
    })

    return res.json({ message: 'Customer created successfully' })    
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

module.exports = { login, signup }