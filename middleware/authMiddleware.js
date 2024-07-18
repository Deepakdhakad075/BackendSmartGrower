const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // console.log("Decoded Token: ", decoded);

      req.user = await User.findById(decoded.id).select('-password');
      
      // console.log("User found: ", req.user);

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.error('No token found');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };

