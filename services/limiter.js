const rateLimit = require('express-rate-limit');
const { HttpCode } = require('./constants');

const createAccountLimiter = rateLimit({
  windowsMs: 30 * 60 * 100,
  max: 100,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Too many requests',
    });
  },
});

module.exports = { createAccountLimiter };
