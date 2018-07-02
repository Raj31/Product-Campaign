const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const accountRoutes = require('./api/routes/accounts');
const campaignRoutes = require('./api/routes/campaigns');

mongoose.connect('mongodb://rajendra_dixit:india123@node-rest-shop-shard-00-00-bos42.mongodb.net:27017,node-rest-shop-shard-00-01-bos42.mongodb.net:27017,node-rest-shop-shard-00-02-bos42.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin');


//Middleware logger, all the request will pass through this.
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
    }
    next();
});
//Routes which handles incoming requrest
app.use('/accounts',accountRoutes);//accountRoutes is declared on top as const, contains path pf products file
app.use('/campaigns',campaignRoutes);

//for invalid request
app.use((req, res, next) => {
    const error = new Error('Route Not found');
    error.staus = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;