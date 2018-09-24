const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

//Handle incomming GET requests to /orders
router.get('/', (req, res, next)=>{
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs=> {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc=>{
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders'+doc._id
                    }
                }
            })    
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});


router.post('/', (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type:'GET',
                    url: 'http://localhost:3000/orders'+result._id
                }
            });
        })
        .catch(err=>{
        if(!req.body.content) {
            return res.status(400).send({
                message: "Wrong content",
                error:err
            });
        }
        console.log(err);
        res.status(500).json({
            message: 'Product not found',
            error: err
        });
    });
});

/*     
router.post('/', (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type:'GET',
                    url: 'http://localhost:3000/orders'+doc._id
                }
            });
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Product not found',
            error: err
        });
    });
    })
    .catch(err => {
        if(!req.body.content) {
            return res.status(400).send({
                message: "Wrong content",
                error:err
            });
        }
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
});
*/


router.get('/:orderId', (req, res, next)=>{
    Order.findById(req.params.orderId)
    .exec()
    .then(order =>{
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order:{
                _id: order._id,
                product: order.product,
                quantity: order.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next)=>{
    Order.findByIdAndDelete({ _id: req.params.orderId})
    .exec()
    .then(result=>{
        if(!result){
            return res.status(404).send({
                message: "Note not found with id " + req.params.orderId
            });
        }
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                   productId: 'ID',
                   quantity: 'Number'
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


module.exports = router;