const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB_URI)

const productRoutes = require('../api/routes/products')
const orderRoutes = require('../api/routes/orders')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    })
})

module.exports = app