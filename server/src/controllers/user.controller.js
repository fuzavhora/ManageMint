const User = require("../models/user.model");
const { sendOtp } = require("../services/otp.services");
const TempUser = require("../models/tempUser");
const UserAccount = require("../models/userAccount.model");
const BankAccount = require("../models/bankAccounts");
const CreditCard = require("../models/creditCard.model");
const Mobile = require("../models/mobile.model");
// const jwt = require("jsonwebtoken")

//Register a new user and send OTP
exports.registerUser = async (req, res) => {
  const { name, email, number, password, gender, age } = req.body;

  if (!name || !email || !number || !password || !gender || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { number: number }],
    });

    if (existingUser) {
      console.log("user already registered");

      return res.send({ status: "failed", message: "User already exists" });
    }

    const existingTemp = await TempUser.findOne({ email });
    if (existingTemp) await TempUser.deleteOne({ email }); // remove previous attempts

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = Date.now() + 10 * 60 * 1000;

    const tempUser = new TempUser({
      name,
      email,
      number,
      password,
      gender,
      age,
      otp,
      otpExpires,
    });

    await tempUser.save();

    await sendOtp(tempUser); // send to mobile and email

    res
      .status(200)
      .json({ message: "OTP sent successfully. Please verify.", tempUser });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

//Verify OTP and register the user

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ otp });

    if (!tempUser) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    if (Date.now() > tempUser.otpExpires) {
      await TempUser.deleteOne({ _id: tempUser._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Create permanent user
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      number: tempUser.number,
      password: tempUser.password,
      gender: tempUser.gender,
      age: tempUser.age,
    });

    await newUser.save();
    await TempUser.deleteOne({ _id: tempUser._id });

    res
      .status(201)
      .json({ message: "OTP verified & user registered successfully" });
  } catch (error) {
    console.error("OTP verification failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const userAccount = await UserAccount.findOne({ user: userId });

    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }

    res.status(200).json({
      message: "User account fetched successfully",
      userAccount,
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addBankAccount = async (req, res) => {
  const { bankName } = req.body;

  if (!bankName) {
    return res.status(400).json({ message: "Bank name is required" });
  }

  try {
    const userId = req.user.id;

    // Check if the bank account already exists for this user
    const existingBankAccount = await BankAccount.findOne({
      user: userId,
      bankName,
    });
    if (existingBankAccount) {
      return res.status(400).json({ message: "Bank account already exists" });
    }

    // Create new bank account (balance will default to 0 if not passed)
    const bankAccount = await BankAccount.create({ user: userId, bankName });

    // Update UserAccount
    const userAccount = await UserAccount.findOne({ user: userId });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }

    userAccount.bankBalance += bankAccount.balance || 0; // default 0
    userAccount.noOfBankAccounts = (userAccount.noOfBankAccounts || 0) + 1;

    await userAccount.save();

    return res.status(201).json({
      message: "Bank account added successfully",
      bankAccount,
      updatedUserAccount: userAccount,
    });
  } catch (error) {
    console.error("Error adding bank account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addCreditCard = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bankName,
      cardNumber,
      cardType,
      expiryDate,
      cardHolderName,
      cvv,
      creditLimit,
      outstandingAmount,
    } = req.body;
    if (
      !bankName ||
      !cardNumber ||
      !cardType ||
      !expiryDate ||
      !cardHolderName ||
      !cvv ||
      !creditLimit
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCard = await CreditCard.findOne({ cardNumber });
    if (existingCard) {
      if (existingCard.user.toString() === userId) {
        return res
          .status(409)
          .json({ message: "You have already registered this credit card" });
      } else {
        return res.status(409).json({
          message: "This credit card is already registered by another user",
        });
      }
    }

    const creditCard = await CreditCard.create({
      user: userId,
      bankName,
      cardNumber,
      cardType,
      expiryDate,
      cardHolderName,
      cvv,
      creditLimit,
      outstandingAmount: outstandingAmount || 0,
    });

    // Update UserAccount
    const userAccount = await UserAccount.findOne({ user: userId });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }
    userAccount.creditCardOutstanding += creditCard.outstandingAmount || 0; // default 0
    userAccount.noOfCreditCards += 1;
    await userAccount.save();
    res.status(200).json({ creditCard });
  } catch (error) {
    console.error("Error adding credit card:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getallcards = async (req, res) => {
  try {
    const userId = "68047b039b1ac0dbb21fd163";
    const cards = await CreditCard.find({ user: userId });

    if (!cards || cards.length === 0) {
      return res
        .status(200)
        .json({ message: "No credit cards found", cards: [] });
    }

    return res.status(200).json({
      message: "Credit cards fetched successfully",
      cards,
    });
  } catch (error) {
    console.error("Error fetching credit cards:", error);
    return res.status(500).json({
      message: "Failed to fetch credit cards",
      error: error.message,
    });
  }
};

const Transaction = require("../models/Transition.model");

exports.addTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      transactionType,
      amount,
      category,
      description,
      paymentMethod,
      isBusiness,
      businessType,
      mobileName,
      platform,
      cashback,
      isSold,
      soldAmount,
    } = req.body;

    // Basic validation
    if (
      !transactionType ||
      !amount ||
      !category ||
      !description ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transactionData = {
      user: userId,
      transactionType,
      amount,
      category,
      description,
      paymentMethod,
      isBusiness: isBusiness || false,
    };

    // Business-specific logic
    if (isBusiness) {
      if (!businessType) {
        return res.status(400).json({
          message: "Business type is required for business transactions",
        });
      }
      transactionData.businessType = businessType;

      // Mobile-specific logic
      if (businessType === "mobile") {
        if (!mobileName || !platform) {
          return res.status(400).json({
            message:
              "Mobile name and platform are required for mobile business transactions",
          });
        }
        transactionData.mobileName = mobileName;
        transactionData.platform = platform;
        transactionData.cashback = cashback || 0;

        // If mobile is sold
        if (isSold) {
          if (!soldAmount) {
            return res
              .status(400)
              .json({ message: "Sold amount is required if item is sold" });
          }
          transactionData.isSold = true;
          transactionData.soldAmount = soldAmount;
        }
      }

      // Add more business logic for 'gold' or 'salary' here if needed
    }

    const newTransaction = await Transaction.create(transactionData);
    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId });
    if (!transactions) {
      return res.status(200).json({ message: "No transactions found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const stats = {
      income: transactions
        .filter((t) => t.transactionType === "income")
        .reduce((sum, t) => sum + t.amount, 0),
      expense: transactions
        .filter((t) => t.transactionType === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//mobile transaction controllers

exports.addMobileTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, platform, price, cashback } = req.body;
    // Basic validation
    if (!name || !platform || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transactionData = {
      user: userId,
      name,
      platform,
      price,
      paymentMode,
      cashback: cashback || 0,
    };

    const userAccount = await UserAccount.findOne({ user: userId });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }
    userAccount.totalMobileValue += price;
    userAccount.totalCashback += cashback;
    userAccount.creditCardOutstanding += price;
    await userAccount.save();

    const creditCard = await CreditCard.findOne({ user: userId , cardNumber : paymentMode });
    if (!creditCard) {
      return res.status(404).json({ message: "Credit card not found" });
    }
    creditCard.outstandingAmount += price;
    await creditCard.save();
    const newTransaction = await Mobile.create(transactionData);
    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMobileTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Mobile.find({ user: userId, isSold: false });
    if (!transactions) {
      return res.status(200).json({ message: "No transactions found" });
    }
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.soldMobile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { soldAmount } = req.body;
    if (!soldAmount) {
      return res.status(400).json({ message: "Sold amount is required" });
    }

    const userAccount = await UserAccount.findOne({ user: userId });
    if (!userAccount) {
      return res.status(404).json({ message: "User account not found" });
    }
    userAccount.totalMobileValue -= soldAmount;

    await userAccount.save();

    const soldMobile = await Mobile.findOneAndUpdate(
      { user: userId },
      { isSold: true, soldAmount: soldAmount },
      { new: true }
    );

    res.status(200).json({ message: "Mobile sold successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
