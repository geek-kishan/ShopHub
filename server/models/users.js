var mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema =  new schema({
    name: String,
    email: String,
    contact: Number,
    company: String,
    password: String
});

module.exports = mongoose.model('users',userSchema,'users');