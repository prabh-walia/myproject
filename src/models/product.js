const { contentType } = require("express/lib/response");
const mongoose = require("mongoose");
const productSchema = new mongoose .Schema({
   
  title : {
      type: String,
      required:true
  },
  desc : {
      type :String
      
  },
  brand_name :{
      type:String,
      required:true
  },
  category : {
      type:String,
      required:true
  },
  quantity: {
      type:Number,
      required:true
  },
  price : {
      type:Number,
      required:true
  },
  model : {
      type: Array,
      required:true,

  },
  colorname : {
      type : Array,
      
  },
  product_id:{
      type:String,
      required:true
  },
  product_of:{
      type:String,
      required:true
  },
  image :String

});
const product_register = new mongoose.model("Product",productSchema);
module.exports = product_register;