const transporter = require('../config/mailer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${CLIENT_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: '"NeuroUX Support" <noreply@neuroux.com>',
    to: email,
    subject: 'Verify Your Email - NeuroUX Marketplace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fcfcfc;">
        <h2 style="color: #4F46E5; text-align: center;">Welcome to NeuroUX!</h2>
        <p>Thank you for registering. Please verify your email address to activate your account and start exploring premium UI/UX components.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">If you did not register for a NeuroUX account, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 11px; text-align: center;">NeuroUX Marketplace, Inc. &copy; 2026</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}: ${info.messageId}`);
    
    // Print preview link if using Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Ethereal Mail Preview URL]: ${previewUrl}`);
    }
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    console.log(`\n==================================================`);
    console.log(`[DEV FALLBACK] Verification Link for ${email}:`);
    console.log(`${verificationUrl}`);
    console.log(`==================================================\n`);
    return { messageId: 'mock-id' };
  }
};

exports.sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: '"NeuroUX Support" <noreply@neuroux.com>',
    to: email,
    subject: 'Reset Your Password - NeuroUX Marketplace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fcfcfc;">
        <h2 style="color: #E11D48; text-align: center;">Password Reset Request</h2>
        <p>We received a request to reset your NeuroUX account password. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #E11D48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">If you did not request a password reset, please secure your account immediately.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 11px; text-align: center;">NeuroUX Marketplace, Inc. &copy; 2026</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}: ${info.messageId}`);
    
    // Print preview link if using Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Ethereal Mail Preview URL]: ${previewUrl}`);
    }
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    console.log(`\n==================================================`);
    console.log(`[DEV FALLBACK] Password Reset Link for ${email}:`);
    console.log(`${resetUrl}`);
    console.log(`==================================================\n`);
    return { messageId: 'mock-id' };
  }
};
