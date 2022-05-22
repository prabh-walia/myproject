
const express = require("express");
const bp = require("body-parser");
const app = express();
const multer = require("multer")
const path = require("path");
var session = require('express-session')
require("./db/conn");

const product = require("./models/product");
const customer = require("./models/customers");
var fs = require('fs');
const seller = require("./models/sellers");
const e = require("express");
const port = process.env.PORT || 3000;
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.use(express.json());
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
    if(typeof n === "string"){

        const product_data = await product.find({category:cate});

        res.render("category",{current : "dashboard" ,session_name: name,data:product_data,cat:cate});

       
    }else {
        const product_data = await product.find({category:cate});

        res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
    }
   
    

    
});
app.get("/clothes", async (req,res)=> {

     
 
    var cate = "clothes"
   if(typeof n === "string"){

       const product_data = await product.find({category:cate});

       res.render("category",{current : "dashboard" ,session_name: name,data:product_data,cat:cate});

      
   }else {
       const product_data = await product.find({category:cate});

       res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
   }
  
   

   
});
app.get("/books", async (req,res)=> {

     
 
    var cate = "books"
   if(typeof n === "string"){

       const product_data = await product.find({category:cate});

       res.render("category",{current : "dashboard" ,session_name: name,data:product_data,cat:cate});

      
   }else {
       const product_data = await product.find({category:cate});

       res.render("category",{current: "notD",session_name: "account",data:product_data,cat:cate});
   }
  
   

   
});
app.get("/seller", async (req,res)=> {
    console.log(req.query.name);
    res.render("sellerRegister");

});
app.get("/desc",async (req,res)=>{
    const product_data = await product.findOne({title:req.query.name});


       res.render("description_item",{data:product_data});
});
app.get("/checkout",async (req,res)=>{  
    if(typeof n === "string"){
        current_product=req.query.name;
        cqty= req.query.q;
        c_color= req.query.c;
        c_model = req.query.m;
    const product_data = await product.findOne({title:current_product});
    const customerd = await customer.findOne({email:n})

    res.render("checkout",{data:product_data,qt:req.query.q,color:req.query.c,model:req.query.m,delp:del,delivery:customerd.deliveryaddress});
}
else {
    res.send("login first");
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


app.post("/account",async (req , res)=>{
    try{
         const email = req.body.username;
         console.log(req.body);
         const loginPassword = req.body.Login_password;
          
  const  dbcustomer = await customer.findOne({email: email});
         
      if(dbcustomer.password===loginPassword){
          req.session.name = dbcustomer.email;
        
           
          n= req.session.name;
          name = dbcustomer.fullname
     
        

      
         
            res.status(201).redirect("/a");
 
           
 
      }else {
   res.send("invalid details")
     }
    
    
    }
    catch(e){
        res.status(400).send(e)
    }
 });
 app.get("/a",async (req,res)=>{
    const product_data = await product.find();
    console.log(product_data);
    res.render("account" ,{session_name:name ,data:product_data});

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
             

                  res.status(201).redirect("/sellerpro");

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
       const dbcustomer = await customer.updateOne({email:n},{
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
    res.status(201).render("seller",{session_name :sellername,data:product_data} );
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
    
     
 
     res.status(201).redirect("/a");
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