var mongoose = require('mongoose');

const schema = mongoose.Schema;

const productSchema = new schema({
    authId:String,
    productName: String,
    category: String,
    price: Number,
    productImagePath: String,
    company: String,
    sellerName: String
})

module.exports = mongoose.model('products',productSchema,'products');