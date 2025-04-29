const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product
        .find()
        .select('_id name price')
        .then(docs => {
            if (docs) {
                const result = {
                    status: 'ok',
                    status_code: 200,
                    data: {
                        count: docs.length,
                        products: docs
                    }
                }
                res.status(200).json(result)
            } else {
                res.status(200).json({
                    status: 'empty',
                    code: 200,
                    message: 'Product List empty',
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })

    product.save()
        .then(product => {
            res.status(201).json({
                status: 'ok',
                status_code: 201,
                message: 'New Product added!',
                product: product
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                error: err
            })
        })


})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Product.findById(id).select('_id name price')
        .then(doc => {
            console.log(doc)
            const result = {
                status: 'ok',
                status_code: 200,
            }
            if (doc) {
                result['data'] = doc
                res.status(200).json(result)
            } else {
                result['status'] = 'not found'
                result['status_code'] = 404
                result['error'] = {
                    message: "Product does not exist"
                }
                res.status(404).json(result)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            })
        })
})

router.patch('/:id', (req, res, next) => {
    const id = req.params.id
        // console.log(req.body)
        // for (const key in req.body) {
        //     console.log('for', key)
        // }
        // res.status(200).json({
        //     message: 'Req received',
        //     request: req.body
        // })
    Product.updateOne({ _id: id }, req.body)
        .then(result => {
            console.log(result)
                // console.log('origin', req.headers)

            res.status(200).json({
                message: 'Update successful',
                modifiedDocument: req.headers.host + '/products/' + id
            })
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Product.findByIdAndDelete(id)
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    message: `Product ${id} deleted`
                })
            } else {
                res.status(404).json({
                    error: 'Product not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

})

module.exports = router