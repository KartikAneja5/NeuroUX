const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

const isPlaceholder = !process.env.EMAIL_USER || 
                      process.env.EMAIL_USER.includes('here') || 
                      process.env.EMAIL_USER === '';

if (isPlaceholder) {
  // Use a stable, pre-created Ethereal test account for instant out-of-the-box operation
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'lorenz.gottlieb82@ethereal.email',
      pass: '659VbC4BynD8fpxhWp'
    }
  });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

module.exports = transporter;
