const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

// Drop this in after a chain of express-validator checks. Turns the
// first validation failure into the same ApiError shape as everything else.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    throw new ApiError(400, first.msg);
  }
  next();
};

module.exports = validate;
