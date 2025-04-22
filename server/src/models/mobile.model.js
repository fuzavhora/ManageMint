const mongoose = require("mongoose");

const mobileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMode : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "CreditCard"
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    soldAmount: {
       type: Number, 
       default: 0,
    },
    cashback: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mobile", mobileSchema);
