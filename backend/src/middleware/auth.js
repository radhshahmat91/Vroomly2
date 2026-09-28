const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

// Verifies the Bearer token on the request and attaches the user document
// to req.user. The frontend is a separate origin from the API, so the
// token travels as an Authorization header rather than a cookie — see
// README "Architecture notes" for why.
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    throw new ApiError(401, 'Not authorized — please log in');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Your session has expired — please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'This account no longer exists');
  }
  if (user.isBanned) {
    throw new ApiError(403, 'This account has been suspended. Contact support for details.');
  }

  req.user = user;
  next();
});

// Usage: router.post('/', protect, authorize('owner', 'admin'), handler)
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Your account type cannot access this resource`);
  }
  next();
};

// Like protect, but a missing/invalid token is not an error — used on
// public routes (e.g. car search) whose response can be personalized
// slightly for a logged-in user without requiring login.
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // ignore — treat as anonymous
    }
  }
  next();
});

module.exports = { protect, authorize, attachUserIfPresent };
