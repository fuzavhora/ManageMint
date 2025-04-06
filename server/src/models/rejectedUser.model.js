const mongoose = require('mongoose');
const { Number } = require('twilio/lib/twiml/VoiceResponse');

const rejectedUserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
    email:{
        type: String,
        required: true
    },
    Number:{
        type: Number,
        required: true
    },
    age : {
        type: Number,
    },
    gender : {
        type: String,
        enum : ["Male", 'Female', 'Other'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

module.exports = mongoose.model('RejectedUser', rejectedUserSchema);
//