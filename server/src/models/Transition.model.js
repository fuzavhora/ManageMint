const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [
      'food', 'transport', 'entertainment', 'utilities', 'shopping', 'other',
      'mobile', 'gold', 'salary', 'business'
    ],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'creditCard', 'cash'],
    required: true
  },

  // ✅ Is it business related?
  isBusiness: {
    type: Boolean,
    default: false
  },

  // ✅ Business details (if isBusiness === true)
  businessType: {
    type: String,
    enum: ['mobile', 'gold', 'salary'],
    required: function () {
      return this.isBusiness === true;
    }
  },

  // ✅ Mobile-specific fields
  mobileName: {
    type: String,
    required: function () {
      return this.isBusiness === true && this.businessType === 'mobile';
    }
  },
  platform: {
    type: String, // e.g., 'Amazon', 'Flipkart', etc.
    required: function () {
      return this.isBusiness === true && this.businessType === 'mobile';
    }
  },
  cashback: {
    type: Number,
    default: 0
  },

  // ✅ Sell status (if mobile or gold was sold)
  isSold: {
    type: Boolean,
    default: false
  },
  soldAmount: {
    type: Number,
    required: function () {
      return this.isSold === true;
    }
  }

}, { timestamps: true });


module.exports = mongoose.model('Transaction', transactionSchema);
