const crypto = require('crypto');
// const twilio = require('twilio');
const sendMail = require('../utils/sendMail');
require('dotenv').config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// console.log(accountSid);

// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log(authToken);

// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// console.log(twilioPhoneNumber);
// if (!accountSid || !authToken || !twilioPhoneNumber) {
//   throw new Error('Twilio credentials are not set in environment variables');
// }


// const client = twilio(accountSid, authToken);

exports.sendOtp = async (userDoc) => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    userDoc.otp = otp;
    userDoc.otpExpire = otpExpire;

    await userDoc.save(); // this only works if userDoc is from `new TempUser(...)`

    // Send SMS
    // await client.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${userDoc.number}`,
    // });

    // Send Email
    await sendMail(userDoc.email, 'ManageMint OTP', `Your OTP is: ${otp}`);
  } catch (err) {
    console.error("❌ Failed to send OTP:", err.message);
    throw new Error("OTP sending failed");
  }
};

