const mongoose  = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: String,
    price: Number,
    qty:Number,
    mode:String,
       userid:{type: mongoose.Types.ObjectId, ref: 'user'},
    seller: {type: mongoose.Types.ObjectId, ref: 'seller'}
   
});

const order = mongoose.model("orders", orderSchema);
module.exports = order;