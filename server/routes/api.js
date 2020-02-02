/*************************** Importing Modules *************************/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const Product = require('../models/products');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const url = require('url');
const crypto = require('crypto');
//const async = require('async');

/************************ Mongoose Connection **************************/

const dbUrl = "mongodb://localhost:27017/amazon1";

mongoose.connect(dbUrl,{useNewUrlParser: true}, function(err){
    if(err) {
        console.log(err);
    }else{
        console.log("Connected with database!");
    }
})

/************************** Token Varifivation *************************/

function verifyToken(req,res,next) {
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized access!");
    }
     let token = req.headers.authorization.split(' ')[1];
     if(token === 'null'){
         return res.status(401).send("Unauthorized access!");
     }
     let payload = jwt.verify(token, 'abcd');
     //console.log(payload);
     if(!payload) {
         return res.status(401).send("Unauthorized access!");
     }
     req.userId = payload.subject;
     next();
}

/************************** Multer Setup ******************************/

const MimeTypeMap = {
    'image/jpeg' : 'jpeg',
    'image/x-icon' : 'ico',
    'image/webp' : 'WebP',
    'image/png' : 'png'
}

var storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        const name = file.originalname.split(' ').join('-');
        const ext = MimeTypeMap[file.mimetype];
        cb(null, name+"-"+Date.now()+"."+ext);
    }
})
const store = multer({storage:storage})

/************************ Crypto Configuration ************************/

function encrypt(password) {
    var key = crypto.createCipher('aes-128-cbc','abcd');
    var newPassword = key.update(password,'utf8','hex');
    return newPassword += key.final('hex');
}

function decrypt(password) {
    var key = crypto.createDecipher('aes-128-cbc','abcd');
    var newPassword = key.update(password,'hex','utf8');
    return newPassword += key.final('utf8')
}

/***************************** API Route ******************************/

router.get('/', (req,res)=> {
    res.send('api works');
});

/*************************** Signup API *****************************/

router.post('/signup',(req,res) => {
    let userData = req.body;
    var email = userData.email;
    delete userData.confirmPassword;
    var newPassword = encrypt(userData.password);
    userData.password = newPassword;

    console.log(userData);
    let user = new User(userData);

    User.findOne({"email": email},(err, alreadyExistUser)=>{
        if(err){
            console.log(err);
        }else if(alreadyExistUser){
            res.status(401).send("User already exist with this Email");
            console.log("User already exists!");
        }else if(!alreadyExistUser){
            addUser();
        }
    })

    function addUser(){
        user.save((err,newUser)=> {
            if(err){
                console.log(err)
            }else{
                let payload = {subject: newUser._id}
                let token = jwt.sign(payload, 'abcd');
                res.status(200).send({token})
                console.log("User registered!");
            }
        })
    }
})

/************************** Login API *******************************/

router.post('/login',(req,res)=>{
    let userData = req.body;
    User.findOne({email:userData.email},(err,user)=>{
        if(err) {
            console.log(err);
        }else if(!user){
            res.status(401).send("No user found!")
        }else if(decrypt(user.password) !== userData.password){
            res.status(401).send("Wrong password!");
        }else {
            console.log(user._id);
            let payload = {subject: user._id}
            let token = jwt.sign(payload, 'abcd');
            res.status(200).send({token});
        }
    })
})

/************************** Delete Profile API ***************************/

router.post('/deleteUser',(req,res)=>{
    userEmail = req.body.email;
    User.findOneAndDelete({"email": userEmail},(err,user)=>{
        if(err) {
            console.log(err);
        }else {
            console.log(user);
            console.log("userDeleted");
            const userId = user._id;
            deleteproducts(userId);
            res.status(200).send("User Deleted!");
        }
    })
})

function deleteproducts(uId) {
    const userId = uId;
    Product.deleteMany({"authId": userId},(err,deletedProducts)=>{
        if(err) {
            console.log(err);
        } else if(!deletedProducts) {
            console.log("No products to delete!");
        } else {
            console.log(deletedProducts);
            console.log("Products deleted!");
        }
    })
}

/************************** Profile Info API **************************/

router.get('/profile',verifyToken,(req,res)=>{
    let id = req.userId;
    User.findById(id,(err,user)=>{
        if(err){
            console.log(err);
        }else if(!user){
            res.status(401).send("No profile found!")
        }else {
            res.status(200).send(user);
        }
    })
});

/*************************** Upload Product API *************************/

router.post('/upload',verifyToken,store.single("image"),(req,res)=>{
    let id = req.userId;
    User.findById(id,(err,userinfo)=>{
        if(!userinfo){
            res.status(401).send("Not authenticated!");
        }else if(err){
            console.log(err);
            res.status(401).send("Error occured");
        }else {
            let productData = new Product();
            let url = req.protocol+"://"+req.get('host');
            productData.authId = req.userId;
            productData.productName = req.body.name;
            productData.category = req.body.category;
            productData.price = req.body.price;
            productData.company = userinfo.company;
            productData.sellerName = userinfo.name;
            productData.productImagePath = url+'/uploads/'+req.file.filename;
            productData.save((err,savedProduct)=>{
                if(err) {
                    res.status(401).send("And error occured while storing data into the database!");
                }else{
                    res.status(200).send("Successfully product stored");
                }
            });
        }
    })
})
/**************************** My Product Count API *************************/

router.get("/productcount",verifyToken,(req,res) => {
    let id = req.userId;
    Product.countDocuments({"authId":id},(err,count) =>{
        if(err) {
            console.log(err);
        }else {
            //console.log(count);
            res.status(200).send({count:count});
        }
    })
})
/******************************* My Products API ***************************/

router.get('/myproducts',verifyToken,(req,res)=>{
    let id = req.userId;
    let pageSize =  +req.query.pagesize;
    let pageNo =  +req.query.pageno;
    skipProducts = pageSize*(pageNo-1);
    Product.find({"authId":id},{},{skip:skipProducts,limit:pageSize},(err,results)=>{
        if(err) {
            console.log(err);
        }else if(!results){
            console.log("no results found");
        }else {
            //console.log(results);
            res.status(200).send(results);
        }
    })
})

/******************************* Home Products API ************************/

router.get('/homeproducts',(req,res)=>{
    Product.aggregate([{$sample:{size:8}}],(err,products)=>{
        if(err){
            console.log(err);
        }else if(!products){
            res.status(401).send("No Random Products Found");
        }else{
            res.status(200).send(products);
           // findSellers();
        }
    })
})

/***************************** Company List API ****************************/

router.get("/companylist",(req,res)=> {
    User.find({},{"company":1},{limit:5},(err,result)=> {
        if(err) {
            console.log(err);
        }else if(!result) {
            console.log("No field found for company!");
        }else {
            res.send(result);
        }
    })
})

/************************** Find Product By Company ************************/

router.post("/findbycompany",(req,res)=>{
    let companyName = req.body.company;
    let pagesize = req.body.pagesize;
    let currentPage = req.body.currentpage;

    let skipDoc = pagesize*(currentPage-1);
    var count;
    var result;
    //console.log(companyName);

    Product.countDocuments({"company":companyName},(err,countNo)=>{
        if(err) {
            console.log(err)
        }
        else {
            count = countNo;
            Product.find({"company":companyName},{},{skip:skipDoc,limit:8},(err,results)=>{
                if(err) {
                    console.log(err);
                }else {
                    res.send({
                        count: count,
                        data: results
                    });
                }
            });
        }
    })
})

/*************************** Find By Category API *************************/

router.post("/findbycat",(req,res)=> {
    let currentPage = req.body.currentpage;
    let pageSize = req.body.pagesize;
    let cat = req.body.category;
    let count;
    let skipCount = pageSize*(currentPage-1);
    Product.countDocuments({"category": cat},(err,doc)=>{
        if(err) {
            console.log(err);
        }else {
            count = doc;
            Product.find({"category":cat},{},{skip: skipCount,limit:8},(err,results)=>{
                if(err) {
                    console.log(err);
                }else {
                    res.send({
                        count: count,
                        data: results
                    });
                }
            })
        }
    })
})

/*************************** Delete Product API ***************************/

router.post('/deleteproduct', (req,res)=>{
    let pname = req.body.productName;
    console.log(pname);

    Product.findOne({"productName": pname},(err,product)=>{
        if(err) {
            console.log("An error occured while fetching product!");
        }else if(!product){
            console.log("No product found!");
        }else {
            const ImageUrl = product.productImagePath;
            console.log(ImageUrl);
            const urlToDelete = new URL(ImageUrl);
            console.log(urlToDelete.pathname);
            var deleteImageByUrl = "."+urlToDelete.pathname;
            fs.unlink(deleteImageByUrl,(err)=>{
                if(err) {
                    console.log(err);
                }else {
                    console.log("Image Deleted");
                }
            })
        }
    })

    Product.findOneAndRemove({"productName": pname}, (err,deletedProduct)=>{
        if(err) {
            console.log(err);
        }else if(!deletedProduct){
            console.log("No Product to Delete!");
            res.status(200).send("No product found to delete!");
        }else {
            console.log(deletedProduct);
            res.status(200).send("Product Deleted!");
        }
    })
})

/**************************** Exporting Module *****************************/

module.exports = router;
