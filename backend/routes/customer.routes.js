const { Router } = require("express")
const customerContoller = require('../controllers/customer.controller')
const { authUser } = require('../middlewares/authUser')

const customerRouter = Router()

customerRouter.post('/serviceLoc', authUser, customerContoller.createServiceLog)
customerRouter.get('/devices', customerContoller.getDevicesList),
customerRouter.get('/serviceLocs', authUser, customerContoller.getServiceLocationsByCustomer)
customerRouter.delete('/serviceLoc/:id', authUser, customerContoller.deleteServiceLocation)
customerRouter.post('/device/register', authUser, customerContoller.createDeviceRegister)

customerRouter.post('/graph/totalenergy/location', authUser, customerContoller.getTotalEnergyPerLocation)
customerRouter.post('/graph/totalenergy/device', authUser, customerContoller.getTotalEnergyPerDevice)
customerRouter.post('/graph/totalprice/location', authUser, customerContoller.getTotalPricePerLocation)
customerRouter.post('/graph/totalprice/device', authUser, customerContoller.getTotalPricePerDevice)

customerRouter.get('/:id', customerContoller.getCustomer)

module.exports = { customerRouter }