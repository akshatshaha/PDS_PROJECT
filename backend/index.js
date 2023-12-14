const express = require('express')
const app = express()
const port = 3001

const cors = require('cors')

const customer_model = require('./customerModel')
const { customerRouter }  =  require('./routes/customer.routes.js')
const { authRouter }  =  require('./routes/auth.routes.js')

app.use(cors({
    origin: '*',
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/customer', customerRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})