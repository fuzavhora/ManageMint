const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tempUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  password: String,
  gender: String,
  age: Number,
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
