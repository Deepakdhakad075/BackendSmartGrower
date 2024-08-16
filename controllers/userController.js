// controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Labour = require('../models/Labour');
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch all labours for the logged-in user
  const labours = await Labour.find({ owner: userId });

  // Calculate total paid amount (sum of receipts and deposits)
  const totalPaid = labours.reduce((acc, labour) => {
    // Calculate total receipt amount for each labour
    const totalReceiptAmount = labour.receipts.reduce((acc, receipt) => acc + receipt.totalPay, 0);

    // Calculate total deposit amount for each labour
    const totalDepositAmount = labour.paid.reduce((acc, deposit) => acc + deposit.totalPaid, 0);

    // Sum both receipts and deposits for the current labour
    return acc + totalReceiptAmount + totalDepositAmount;
  }, 0);

  // Calculate total due amount
  const totalDue = labours.reduce((acc, labour) => {
    return acc + labour.receipts.reduce((acc, receipt) => acc + receipt.due, 0);
  }, 0);

  // Fetch user details
  const user = await User.findById(userId);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      totalLabours: labours.length,
      totalPaid,
      totalDue
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});




module.exports = { registerUser, loginUser, getUserProfile };
