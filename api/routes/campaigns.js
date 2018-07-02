const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Campaign = require('../models/campaign');

router.get('/', (req, res, next) => {
    //to get the value of additional query parameters, use below code for query string color
    //const color = req.query.color;
    Campaign.find()
        .select({'campaignname':1,'startdate':1,'enddate':1,'advertiser':1})
        .exec()
        .then(doc => {
            console.log('From database:', doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

 //res.status(200).json({
    //    message: 'Handling GET request to /products'
    //});
});//url, handler


router.post('/', (req, res, next) => {
  
    const campaign = new Campaign({
        _id: new mongoose.Types.ObjectId(),
        campaignname: req.body.campaignname,
        startdate: req.body.startdate,
        enddate:req.body.enddate,
        advertiser:req.body.advertiser,
        budget:req.body.budget,
        budgetapproved:false,
        budgetapprovedby:'',
        budgetapprovedOn:null,
        ads:null
    });
    campaign
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /campaigns',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
        

});//url, handler




module.exports = router;