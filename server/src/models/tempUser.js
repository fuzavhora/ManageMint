const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');

  const tempUserSchema = new mongoose.Schema({
    name : {
      type : String,
      required : true,
  },
  email : {
    type : String,
    required : true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password : {
    type : String,
    required : true,
    minlength: 8
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
    otp: String,
    otpExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600 // auto delete after 10 mins
    }
  });

  tempUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  module.exports = mongoose.model('TempUser', tempUserSchema);
