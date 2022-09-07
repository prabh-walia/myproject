
const express = require("express");
const bp = require("body-parser");
const app = express();
const multer = require("multer")
const path = require("path");
var session = require('express-session')
require("./db/conn");
const order = require("./models/order")
const cookieParser = require("cookie-parser");

const product = require("./models/product");
const customer = require("./models/customers");
var fs = require('fs');
const seller = require("./models/sellers");
const e = require("express");
const { profile } = require("console");
const seller_register = require("./models/sellers");
const port = process.env.PORT || 3000;
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'its secret',
    resave: false,
    saveUninitialized: true
  
  }));
  //storage 
  
  const storage =multer.diskStorage({
    
        destination:function (req, file, cb) {
          cb(null, './uploads')
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
        }
      
  
})
var upload = multer({
    storage:storage,
    fileFilter:function(req,file,callback){
        if(
        file.mimetype=="image/jpg"||
        file.mimetype=="image/png"||
        file.mimetype=="image/jpeg"
     
        )
    {
        callback(null,true)
    }
    else {
        callback(null,false)
    }
    }
})
const static_path = path.join(__dirname, "../public/");

app.use(express.static('uploads'));
app.use(express.static(static_path));
app.set("view engine","ejs");
//routes
var n ;
var name ;
var sellermail;
var sellername;
const del=50;
var current_product;
var c_color;
var c_model;
var cqty;

app.get("/",async(req,res)=>{
    const product_data = await product.find();
    console.log(product_data);
    res.render("index" ,{data:product_data});
   
    
 


});
app.get("/electronics", async (req,res)=> {

     
 
     var cate = "Electronics"
     const token = req.cookies.email;
      
      const names=await customer.findOne({email:token})
    
    if(  typeof token  === "string"){

        const product_data = await product.find({category:cate});

        res.render("category",{current : "dashboard" ,session_name: names.fullname,data:product_data,cat:cate});

       
    }else {
        const product_data = await product.find({category:cate});

        res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
    }
   
    

    
});
app.get("/clothes", async (req,res)=> {

    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
 
    var cate = "clothes & Fashion"
   if(typeof token === "string"){

       const product_data = await product.find({category:cate});

       res.render("category",{current : "dashboard" ,session_name: names.fullname,data:product_data,cat:cate});

      
   }else {
       const product_data = await product.find({category:cate});

       res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
   }
  
   

   
});
app.get("/books", async (req,res)=> {

     
    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
    var cate = "books"
   if(typeof token === "string"){

       const product_data = await product.find({category:cate});

       res.render("category",{current : "dashboard" ,session_name: names.fullname,data:product_data,cat:cate});

      
   }else {
       const product_data = await product.find({category:cate});

       res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
   }
  
   

   
});
app.get("/get",async (req,res)=>{
    const tag = req.query.tag;
    var ss;
    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
           if(typeof name ==="string"){
           ss=name;
           current="dashboard"
           }
           else {
ss="account";
current="";
           }
    var products=[];
        const items = await product.find({title:tag})
        if(items.length>0){
            console.log("skms");
            if(typeof token==="string"){
            res.render("category",{data:items,cat:tag,session_name:names.fullname,current:current})
            }
            else {
                res.render("category",{data:items,cat:tag,session_name:"account",current:current})
            }
        }
        else {
           const items = await product.find();
             for(var i =0;i<items.length;i++){
               const a=  items[i].desc.split(" ")
                for(var j=0;j<a.length;j++){
                     if(a[j]===tag){
                          products.push(items[i]);
                     }
                }
             }
           
             if(typeof token==="string"){
                res.render("category",{data:items,cat:tag,session_name:names.fullname,current:current})
                }
                else{
                    res.render("category",{data:items,cat:tag,session_name:"account",current:current})
                }
        }
      

       
})
app.get("/seller", async (req,res)=> {
    console.log(req.query.name);
    res.render("sellerRegister");

});
app.get("/desc",async (req,res)=>{
    const product_data = await product.findOne({title:req.query.name});

    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
             if(typeof token==="string"){
                res.render("description_item",{data:product_data,session_name:names.fullname});
             }
             else {
                res.render("description_item",{data:product_data,session_name:"account"});
             }
    
});

app.get("/cart",async (req,res)=>{
    const token = req.cookies.email;
    current_product=req.query.name;
    const product_data = await product.findOne({title:current_product});
    var status;
    if(typeof token  === "string"){
        const cust = await customer.findOne({email:token})
        console.log(cust.cartitems.length);
        for(var i = 0;i<=cust.cartitems.length-1;i++){
            if(cust.cartitems[i]===product_data.title){
               status = true;
            }
            else {
                status= false;
            }
            

        }
        
        if(status ===false){
       
  
     const customerd = await customer.updateOne({email:token},
        
          
            {
            $push:{
                cartitems:product_data.title
      
            }
        })
  
         res.redirect("/desc?"+"name="+product_data.title)

    }
    else {
        res.send("item already in cart")
    }
    }

})
app.get("/mycart",async(req,res)=>{
    const token = req.cookies.email;
     const cust=await customer.findOne({email:token})
     var list =[];
        console.log(cust.cartitems);
      for(var i=0;i<cust.cartitems.length;i++){
           const detail = await product.findOne({title:cust.cartitems[i]})
           list.push(detail);


      }
        
        res.render("cart",{session_name:cust.fullname,item:list})
})
app.get("/checkout",async (req,res)=>{  
    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
    if(typeof token  === "string"){
        current_product=req.query.name;
        cqty= req.query.q;
        c_color= req.query.c;
        c_model = req.query.m;
    const product_data = await product.findOne({title:current_product});
    const customerd = await customer.findOne({email:token})

    res.render("checkout",{data:product_data,qt:req.query.q,color:req.query.c,model:req.query.m,delp:del,delivery:customerd.deliveryaddress});
}
else {
    res.send("<div style="+"color:#000;background:grey;width:100%;height:50px;padding-left:50%;padding-top:2%"+">"+"LOGIN FIRST<div>");
}
})

app.post("/registerSeller",async (req,res)=>{
    try{
        const password = req.body.pass;
        const cpass = req.body.Cpass;

        if(password === cpass){
            const seller_detail =  new seller({
                fullname: req.body.fullname,
                email: req.body.email,
                state:req.body.state,
                mobileNo:req.body.phone,
                city:req.body.city,
                password:req.body.pass,
                business_name:req.body.buss,
                Gst:req.body.code,
                pickupLocation:req.body.pickup


              
    
            });
            const rseller= await seller_detail.save();
            req.session.name= rseller.email
            res.status(201).render("seller",{session_name:rseller.fullname});
            sellermail= rseller.email;
            sellername = rseller.fullname;

    }
  
        else {
            res.send("password not matched");
        }
    }
    

catch(e){
    res.status(400).send(e);
}
});
app.get("/orders",async (req,res)=>{
    const token = req.cookies.email;
      
    const names=await customer.findOne({email:token})
const orders=await order.find({userid:names._id})
    res.render("order",{orders:orders,session_name:names.fullname})

})
app.get("/proceed",async (req,res)=>{
    const qty = req.query.qty;
    const namee = req.query.name;
    console.log(name);
    const token = req.cookies.email;
    const r = await order.create(req.query);
    const products = await product.findOne({title:namee})
    const pricee = products.price*qty;
    
    const user =await  customer.findOne({email:token})
    const seller = await seller_register.findOne({email:products.product_of})
    console.log(user);
    const update= await order.updateOne({ _id:r._id},
        
          
        {
        $set:{
            price:pricee,
          userid:user._id,
          seller:seller._id
  
        }
    })
res.send("payment done")
})

app.post("/account",async (req,res)=>{
    try{
         const email = req.body.username;
         console.log(email);
         const loginPassword = req.body.Login_password;
          
  const  dbcustomer = await customer.findOne({email: email});
         console.log(dbcustomer);
      if(dbcustomer.password===loginPassword){
     
          res.cookie("email",email,{
            httpOnly:true,
            expires:new Date(Date.now()+ 60000000)
        })
       
            
        const product_data = await product.find();
        console.log(product_data);
        res.render("account" ,{session_name:dbcustomer.fullname ,data:product_data});
 
        
      }else {
   res.send("<div style="+"color:#000;background:grey;width:100%;height:50px;padding-left:40%;padding-top:2%"+">"+"email or password dosent match,enter valid details<div>")
     }
    
    
    }
    catch(e){
        res.status(400).send("email not found")
    }
 });
 app.post("/delete",async (req,res)=>{
    const name = req.query.name;
    const price = req.query.price;
    console.log(name+price);
    const deletes = await product.deleteOne({title:name,price:price});
    console.log(deletes);
    const product_data = await product.find({product_of:sellermail});
    const sell = await seller.findOne({email:sellermail})
    const orders = await order.find({res:sell._id});
    res.status(201).render("seller",{session_name :sellername,data:product_data,orders:orders} );

 })
 
 app.post("/loginSeller" , async (req,res)=>{
     try {
              const email = req.body.username;
              const pass =  req.body.password;

              const dbcustomer = await seller.findOne({email:email});

              if(dbcustomer.password === pass){
                  req.session.name = dbcustomer.email;
                  sellermail = req.session.name;
                  sellername = dbcustomer.fullname;
             

                  const product_data = await product.find({product_of:sellermail});
                  const sell = await seller.findOne({email:sellermail})
                  const orders = await order.find({res:sell._id});

    res.status(201).render("seller",{session_name :sellername,data:product_data,orders:orders} );


              }
              else{
                  res.send("wrong credentials")
              }
     }
     catch(e){
        res.send(e);
     }

 });
 app.post("/edit",async (req,res)=>{
    try{
       const address = req.body.address;
       console.log(address)
       const token = req.cookies.email;
      
      
       const dbcustomer = await customer.updateOne({email:token},{
           $set :{
               deliveryaddress:address
           }
       });

       res.redirect(`/checkout?name=${current_product}&q=${cqty}&c=${c_color}&m=${c_model}`);

    }
catch(e){
   res.send(e);
}
})
 app.post("/addproduct",upload.single('image'),(req,res)=>{
  try {
  var a=1;
     console.log(sellermail);
        if(typeof sellermail ==="string"){
           var mod = req.body.model;
          const modelarray = mod.split(",");
        var color= req.body.color;
        const colorarray = color.split(",");
       
            const product_detail = new product({
         
                title:req.body.title,
                desc : req.body.description,
               brand_name :req.body.brand,
               
               category : req.body.cat,
               quantity: req.body.qty,
               price :req.body.buss,
               model :modelarray,
               colorname : colorarray,
               product_id:a,
               product_of:sellermail,
                image:req.file.filename
           

            });
            const pdetail=   product_detail.save((err,doc)=>{
                if(!err){
                    console.log("submitted");
                   
                    res.redirect("/sellerpro");
                }
                else {
                   
                    console.log(err);
                }

            });
           
  
        }
        
      

       
        else {
            res.send("login first");
        }
    
  }
  catch(e){
  res.send(e);
  console.log(e);
  }
 })
app.get("/sellerpro", async(req,res)=>{

    const product_data = await product.find({product_of:sellermail});
  console.log(product_data);
  const sell = await seller.findOne({email:sellermail})
                  const orders = await order.find({res:sell._id});
    res.status(201).render("seller",{session_name :sellername,data:product_data,orders:orders} );
})

app.post("/getDetail", async (req,res)=>{
   try{
   const password = req.body.assword;
   const cpass = req.body.onfirmpassword;
   if(password === cpass){
        const customer_detail =  new customer({
            fullname: req.body.fullname,
            email: req.body.email,
            state:req.body.state,
            city:req.body.text,
            password:req.body.assword,
            confirmpassword:req.body.onfirmpassword,
            deliveryaddress:" "

        })
     const registered = await customer_detail.save();
     req.session.name = registered.email;
     res.status(201).redirect("/");
     n=req.session.name;
   name=registered.fullname;
   }else {
       res.send("password not matched");
   }
   }
   catch(w){
       res.status(400).send(w);
   }
      
})

app.post("/logout", async (req,res)=>{
    try{
   
        

         req.session.destroy();
         res.clearCookie("email");
           res.redirect("/");
           
     n= null;
     
    }
    catch(e){
        res.send(e);
    }

})

app.listen(port,()=>{
    console.log("server  is working");
});