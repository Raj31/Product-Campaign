const mongoose = require('mongoose');

const adsSchema = mongoose.Schema({
    addname:String,
    addtype:[]
});

const campaignSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    campaignname: String,
    startdate: Date,
    enddate:Date,
    advertiser:[],
    budget:Number,
    budgetapproved:Boolean,
    budgetapprovedby:String,
    budgetapprovedOn:Date,
    ads:[adsSchema]
});

module.exports = mongoose.model('Campaign',campaignSchema);//mongoose will pluralize Campaign to Campaigns