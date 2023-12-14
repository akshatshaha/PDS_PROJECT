const { Router } = require("express");
const authController = require("../controllers/auth.controller");


const authRouter = Router()

authRouter.post('/login', authController.login)

authRouter.post('/signup', authController.signup)


module.exports = { authRouter }