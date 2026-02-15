const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: 'user created'
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const isCorrect = await user.correctPassword(
      password,
      user.password
    );

    if (!isCorrect) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};
