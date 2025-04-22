const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
    },
    cardType: {
        type: String,
        enum: ['Visa', 'MasterCard', 'American Express', 'Discover', 'rupay'],
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: Number,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    outstandingAmount: {
        type: Number,
        default: 0
    },
    creditLimit: {
        type: Number,
        required: true
    },
    billDueDate: {
        type: Date,
        required: true,
        default: Date.now() + 30 * 24 * 60 * 60 * 1000 // Default to 30 days from now
    },
    billAmount : {
        type: Number,
        required: true,
        default: 0
    },
},{ timestamps: true });

const CreditCard = mongoose.model('CreditCard', creditCardSchema);
module.exports = CreditCard;