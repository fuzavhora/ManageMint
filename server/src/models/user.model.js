const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    number : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        enum : ['Male','Female','Other'],
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    otp : {
        type : String,
    },
    otpExpire : {
        type : Date,
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user',
    },
},{
  timestamps: true})



module.exports = mongoose.model('User', userSchema);