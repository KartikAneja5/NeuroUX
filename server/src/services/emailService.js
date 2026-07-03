const transporter = require('../config/mailer');
exports.sendVerificationEmail = async (email, token) => {
  console.log(`Sending verification to ${email} with token ${token}`);
};
exports.sendResetPasswordEmail = async (email, token) => {
  console.log(`Sending reset to ${email} with token ${token}`);
};
