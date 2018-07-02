const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Account = require('../models/account');

var ObjectId = mongoose.Schema.Types.ObjectId;

router.get('/', (req, res, next) => {
    //to get the value of additional query parameters, use below code for query string color
    //const color = req.query.color;
    Account.find()
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
  
    const account = new Account({
        _id: new mongoose.Types.ObjectId(),
        accountname: req.body.accountname,
        timezone: req.body.timezone,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        country:req.body.country,
        zip:req.body.zip,
        phone:req.body.phone,
        users:[{
            username:req.body.users[0].username,
            email: req.body.users[0].email,
            password: req.body.users[0].password,
            accesstype: req.body.users[0].accesstype,
            status: req.body.users[0].status
        }] 
    });
    account
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST request to /accounts',
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




router.get('/:accountId', (req, res, next) => {
    //how to call
    //http://localhost:3000/accounts/5aef5fb1d786d03dd422b38c

    const id = req.params.accountId;
    //res.status(200).json({
      //  message: 'Handling GET request for id::'+ id
    //});

    Account.findById(id)
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

router.get('/user/:accountId/:userId', (req, res, next) => {

    //how to call
    //http://localhost:3000/accounts/5aef5fb1d786d03dd422b38c
    const id = req.params.accountId;
    const userId =req.params.userId;

    Account.findById(id, function(err, post) {
        var subDoc = post.users.id(userId);
        res.status(200).json(subDoc);
      
      });

});

router.post('/user', (req, res, next) => {
  
    const id = req.body.accountId;
    var user={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        accesstype:req.body.accesstype,
        status:req.body.status
    }

    //{$addToSet : {"items" : {'item_name' : "my_item_two" , 'price' : 1 }} }
    Account.update({ _id: id }, { $push: {"users":user} })
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>
        {
            console.log(err);
            res.status(500).json({
                error:err,
                userPassed:user,
                id:id
            })
        }

    )
        

});

router.patch('/user/:accountId/:userId', (req, res, next) => {
  //how to call
  //[
  //	{"propName":"email", "value":"paperjag@yahoo.com"}
  //]

    const id = req.params.accountId;
    const userId =req.params.userId;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Account.findById(id, function(err, post) {
        var subDoc = post.users.id(userId);
        subDoc.set(updateOps);
      
        // Using a promise rather than a callback
        post.save().then(function(savedPost) {
          //res.send(savedPost);
          res.status(200).json(savedPost);
        }).catch(function(err) {
          res.status(500).send(err);
        });
      });

});

router.patch('/:accountId', (req, res, next) => {
    //how to call
    //http://localhost:3000/accounts/5aef5fb1d786d03dd422b38c
    //in body, data should be sent in array, like below
    //[
    //    {"propName":"city", "value":"Novi"}
    //]
    //to add new user document in account
    //https://docs.mongodb.com/manual/reference/operator/update/push/

    
    const id = req.params.accountId;

    //res.status(200).json({
    //    message: 'Handling Patch request for id::' + id
    //});

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Account.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>
        {
            console.log(err);
            res.status(500).json({
                error:err
            })
        }

    )


    /*
   
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>
        {
            console.log(err);
            res.status(500).json({
                error:err
            })
        }

    )
    */
});

router.delete('/:accountId', (req, res, next) => {

    const id = req.params.accountId;

    //res.status(200).json({
    //    message: 'Handling DELETE request  for id::' + id
    //});
    Account.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            accountId:id
        })
    })

    /*
    Account.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(
                {   
                    result:result,
                    accountId:id
                }
            )
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                accountId:id
            })
        })

         */
    });
   

    module.exports = router;