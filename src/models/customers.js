const mongoose = require("mongoose");

const customerSchema = new mongoose .Schema({
   fullname : {
       type:String,
       required:true
   },
   email : {
    type:String,
    required:true,
    unique:true
},
  state : {
      type:String,
      required:true
  },
  city : {
      type:String,
      required:true
  },
  password : {
      type:String,
      required:true
  },
  cartitems:{
      type:Array,
  },
  deliveryaddress:{
      type:String
  }




});
const Registercustomer = new mongoose.model("Customers",customerSchema);
module.exports= Registercustomer;