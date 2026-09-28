const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const allowedRoles = ['user', 'owner'];
  const finalRole = allowedRoles.includes(role) ? role : 'user';

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(400, 'An account with that email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: finalRole });

  const token = generateToken(user._id, user.role);
  res.status(201).json({ success: true, token, user: user.toSafeObject() });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  if (user.isBanned) {
    throw new ApiError(403, 'This account has been suspended. Contact support for details.');
  }

  const token = generateToken(user._id, user.role);
  res.json({ success: true, token, user: user.toSafeObject() });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { register, login, getMe };
