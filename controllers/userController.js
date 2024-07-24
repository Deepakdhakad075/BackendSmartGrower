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

// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const labours = await Labour.find({ owner: userId });
  const user = await User.findById(req.user._id);
  const totalPaid = labours.reduce((acc, labour) => {
    return acc + labour.receipts.reduce((acc, receipt) => acc + receipt.totalPay, 0);
  }, 0);

  const totalDue = labours.reduce((acc, labour) => {
    return acc + labour.receipts.reduce((acc, receipt) => acc + receipt.due, 0);
  }, 0);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    totalLabours: labours.length,
    totalPaid,
    totalDue
  });
});



module.exports = { registerUser, loginUser, getUserProfile };
