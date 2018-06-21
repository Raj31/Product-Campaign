const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    accesstype:String,
    status:String
});

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accountname: String,
    timezone: String,
    address:String,
    city:String,
    state:String,
    country:String,
    zip:String,
    phone:String,
    users:[userSchema]
});

module.exports = mongoose.model('Account',accountSchema);//mongoose will pluralize Account to Accounts