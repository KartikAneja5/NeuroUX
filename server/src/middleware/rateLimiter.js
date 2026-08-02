const rateLimit = require('express-rate-limit');

// Rate limiter for authentication routes (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  }
});

// Rate limiter for behavioral interaction logging (prevents ML data poisoning spam)
const interactionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 interaction logs per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many interaction logging requests from this IP, rate limit exceeded.'
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  authLimiter,
  interactionLimiter,
  apiLimiter
};
