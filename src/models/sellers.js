const mongoose = require("mongoose");
const sellerSchema = new mongoose .Schema({
   
    fullname :{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    mobileNo : {
        type:Number,
        required:true,
        unique:true
    },
    state: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    business_name: {
        type:String,
        required:true
        
    } ,
    Gst : {
        type: String,
        required:true
    },
    pickupLocation  : {
        type:String,
        required:true
    }

});
const seller_register = new mongoose.model("Sellers",sellerSchema);
module.exports = seller_register;