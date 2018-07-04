const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Campaign = require('../models/campaign');
const moment = require('moment');

router.get('/', (req, res, next) => {
    //to get the value of additional query parameters, use below code for query string color
    let status = req.query.status;
    let filterCriteria='';
    console.log("Status is 11111:",status);
    if(status==null){
        status='active'
    }
    if(status=='active'){
        filterCriteria = {
            "enddate": {
           "$gt" : moment().format()
            }
        }
    }else{
        filterCriteria = {
            "enddate": {
           "$lte" : new Date(moment().format())
            }
        }
    }

    console.log(filterCriteria);
    
    console.log("Status is:",status);
    Campaign.find(filterCriteria)
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


router.get('/:campaignId', (req, res, next) => {
    //how to call
    //http://localhost:3000/campaigns/5aef5fb1d786d03dd422b38c

    const id = req.params.campaignId;
    //res.status(200).json({
      //  message: 'Handling GET request for id::'+ id
    //});

    Campaign.findById(id)
    .exec()
    .then(doc => {
        console.log('From database:', doc);

        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "Id not found",
                id:id
            });
        };
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })
});


module.exports = router;