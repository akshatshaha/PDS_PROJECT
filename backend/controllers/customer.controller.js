const customer_model = require('../customerModel')
const { pool } = require('../db')
const { tx } = require('../utils/tx')

const getCustomer = async (req, res) => {
  try {
    const customers = await customer_model.getCustomer(req.params.id)
    res.json(customers)
  } catch (e) {
    res.json({ error: e.message })
  }
}

const createServiceLog = async (req, res) => {
  try {
    const address = await customer_model.registerAddress(pool, req.body)
    await tx(async client => {
      await customer_model.registerServiceLoc(client, address.addressid, req.body)
      console.log("service loc")
      await customer_model.registerCustomerAddress(client, req.customer.id, address.addressid, req.body.isBilling)
      console.log("customeraddress")
    })
    res.json({ message: 'Service log created successfully' })
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

const getDevicesList =  async (req, res) => {
  try {
    console.log("getting devices...")
    const devices = await customer_model.getDevicesList()
    console.log(devices)
    return res.json({devices})
  } catch (e) {
    console.error(e)
    res.json({ error: e.message })
  }
}

const getServiceLocationsByCustomer = async (req, res) => {
  try {
    const serviceLocations = await customer_model.getServiceLocByCustomerId(req.customer.id)
    return res.json(serviceLocations)
  } catch (e) {
    console.error(e)
    res.json({ error: e.message })
  }
}

const deleteServiceLocation = async (req, res) => {
  console.log(req.params)
  try {
    await customer_model.deleteServiceLocation(Number(req.params.id))
    return res.json({ message: 'Deleted service location successfully' })
  } catch (e) {
    console.error(e)
    res.json({ error: e.message })
  }
}

const createDeviceRegister = async (req, res) => {
  try {
    await customer_model.createDeviceRegister(req.body.deviceID, req.body.serviceID)
    return res.json({ message: 'Device registered successfully' })
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

const getTotalEnergyPerLocation = async (req, res) => {
  try {
    const totalEnergy = await customer_model.getTotalEnergyPerLocation(req.customer.id, req.body)
    return res.json(totalEnergy)
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

const getTotalEnergyPerDevice = async (req, res) => {
  try {
    const energyPerDevice = await customer_model.getTotalEnergyPerDevice(req.customer.id, req.body)
    return res.json(energyPerDevice)
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

const getTotalPricePerLocation = async (req, res) => {
  try {
    const totalPrice = await customer_model.getTotalPricePerLocation(req.customer.id, req.body)
    return res.json(totalPrice)
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}

const getTotalPricePerDevice = async (req, res) => {
  try {
    const pricePerDevice = await customer_model.getTotalPricePerDevice(req.customer.id, req.body)
    return res.json(pricePerDevice)
  } catch (e) {
    console.log(e)
    res.json({ error: e.message })
  }
}



module.exports = { 
  getCustomer, 
  createServiceLog,
  getDevicesList,
  deleteServiceLocation,
  getServiceLocationsByCustomer,
  createDeviceRegister,
  getTotalEnergyPerLocation,
  getTotalEnergyPerDevice,
  getTotalPricePerLocation,
  getTotalPricePerDevice
}