const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankBalance: {
        type: Number,
        required: true,
        default: 0
    },
    noOfBankAccounts: {
        type : Number,
        required : true,
        default : 0
    },
    creditCardOutstanding: {
        type: Number,
        required: true,
        default: 0
    },

    noOfCreditCards: {
        type: Number,
        required: true,
        default: 0
    },
    totalCashInHand : {
        type: Number,
        required: true,
        default: 0
    },
    goldValue : {
        type: Number,
        required: true,
        default: 0
    },

    totalMobileValue : {
        type: Number,
        required: true,
        default: 0
    },
    paytmCashback : {
        type: Number,
        required: true,
        default: 0
    },
    expenses : {
        type: Number,
        required: true,
        default: 0
    },
    totalIncome : {
        type: Number,
        required: true,
        default: 0
    },
    totalSaving :{
        type: Number,
        required: true,
        default: 0
    }
},{timestamps: true});

const UserAccount = mongoose.model('UserAccount', userAccountSchema);

module.exports = UserAccount;