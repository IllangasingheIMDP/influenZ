const nodemailer = require('nodemailer');
const Redis = require('ioredis');
const InfluencerModel = require('../models/influencerModel');
const pool = require('../db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendOTP = async (req, res) => {
  const redis = req.app.locals.redis; // Access Redis instance from app.locals
  const { userId } = req.body;
  const email=req.user.email;
  try {
    

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in Redis with a 5-minute expiration (300 seconds)
    const influencerId = await InfluencerModel.getInfluencerId(userId);
    await redis.set(`otp:${influencerId}`, otp, 'EX', 300);

    // Send the OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Email Verification',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOTP = async (req, res) => {
  const redis = req.app.locals.redis; // Access Redis instance from app.locals
  const { userId, otp } = req.body;

  try {
    const influencerId = await InfluencerModel.getInfluencerId(userId);

    // Retrieve the OTP from Redis
    const storedOTP = await redis.get(`otp:${influencerId}`);
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    // Verify the OTP
    if (storedOTP === otp) {
      // Update the influencer's email verification status
      await InfluencerModel.updateEmailVerification(userId, true);
      // Delete the OTP from Redis
      await redis.del(`otp:${influencerId}`);
      res.json({ success: true, message: 'Email verified successfully' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

module.exports = { sendOTP, verifyOTP };