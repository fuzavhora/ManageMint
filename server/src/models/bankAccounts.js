const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankName: {
        type: String,
        required: true,
    },
    // accountNumber: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // ifscCode: {
    //     type: String,
    //     required: true
    // },
    // accountType: {
    //     type: String,
    //     enum: ['savings', 'current'],
    //     required: true
    // },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
}, { timestamps : true });

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;