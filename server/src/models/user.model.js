const mongoose = require('mongoose');
const UserAccount = require('./userAccount.model'); // <-- adjust path if needed

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpire: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// 💡 Automatically create a UserAccount when a User is created
userSchema.post('save', async function (doc, next) {
    try {
        await UserAccount.create({
            user: doc._id, // Link to the user
            bankBalance: 0,
            creditCardOutstanding: 0,
            noOfCreditCards: 0,
            totalCashInHand: 0,
            goldValue: 0,
            totalMobileValue: 0,
            paytmCashback: 0,
            expenses: 0,
            totalIncome: 0,
            totalSaving: 0
        });
        next();
    } catch (error) {
        console.error('Failed to create user account:', error);
        next(error); // pass error to Mongoose
    }
});

module.exports = mongoose.model('User', userSchema);
