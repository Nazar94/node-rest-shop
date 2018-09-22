const express = require('express');
const app = express();
//installed morgan using for hadling errors
const morgan = require("morgan");
//installed bodyparser
const bodyParser = require('body-parser');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//use morgan
app.use(morgan('dev'));
//use bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//add before routes CORS(adding headers)
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');//'*' means to give the access to any client, may set only your donmain
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Authorization' //al these headers could be appended to our request
     );
     if(req.method==='OPTIONS'){
         res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');//What methods should to support with OPTIONS
        return res.status(200).json({});
        }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;