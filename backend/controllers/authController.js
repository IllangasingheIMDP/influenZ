const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const InfluencerModel = require('../models/influencerModel');
const brandModel = require('../models/brandModel');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const pool = require('../db');
class AuthController {
  // static async signup(req, res) {
  //   const { email, password, firstName, lastName, contactInfo,role } = req.body;
  //   try {
  //     const file = req.file;
  //     if (!file) {
  //       return res.status(400).json({ message: 'No file uploaded' });
  //     }
  //     const result = await new Promise((resolve, reject) => {
  //       const stream = cloudinary.uploader.upload_stream(
  //         { resource_type: 'image' },
  //         (error, result) => {
  //           if (error) reject(error);
  //           else resolve(result);
  //         }
  //       );
  //       stream.end(file.buffer);
  //     });
  //     const existingUser = await UserModel.findByEmail(email,role);
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'Email already exists' });
  //     }
  //     const newUser = await UserModel.createUser(email, password, firstName, lastName, contactInfo,role);
  //     if(role==='brand'){
  //       const {company_details,social_media_handles,company_name}=req.body;
  //       await brandModel.initiateBrand(newUser.user_id,company_details,social_media_handles,company_name,result.secure_url);
  //     }else if(role==='influencer'){
  //       const {gender,age,country,profile_pic}=req.body;
  //       await InfluencerModel.initiateInfluencer(newUser.user_id,result.secure_url,gender,age,country);
  //     }
      
  //     console.log('user created successfully');
  //     res.status(201).json({success: true, message: 'User created successfully' });
  //   } catch (error) {
  //     console.log('Error creating user:', error);
  //     res.status(500).json({success: false, message: error.message });
  //   }
  // }
  static async signup(req, res) {
    const { email, password, firstName, lastName, contactInfo, role } = req.body;
    let client; // Declare client outside try block for access in catch/finally
    try {
      // Handle file upload to Cloudinary first
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      // Start database transaction
      client = await pool.connect();
      await client.query('BEGIN');

      // Check for existing user within the transaction
      const existingUser = await UserModel.findByEmail(email, role, client);
      if (existingUser) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Create user
      const newUser = await UserModel.createUser(email, password, firstName, lastName, contactInfo, role, client);

      // Create role-specific entry
      if (role === 'brand') {
        const { company_details, social_media_handles, company_name } = req.body;
        await brandModel.initiateBrand(newUser.user_id, company_details, social_media_handles, company_name, result.secure_url, client);
      } else if (role === 'influencer') {
        const { gender, age, country } = req.body; // Removed profile_pic from req.body since it's from Cloudinary
        await InfluencerModel.initiateInfluencer(newUser.user_id, result.secure_url, gender, age, country, client);
      }

      // Commit transaction if all operations succeed
      await client.query('COMMIT');
      console.log('User created successfully');
      res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
      // Roll back transaction on error
      if (client) {
        await client.query('ROLLBACK');
      }
      console.log('Error creating user:', error);
      res.status(500).json({ success: false, message: error.message });
    } finally {
      // Release client back to pool
      if (client) {
        client.release();
      }
    }
  }

  static async Influencerlogin(req, res) {
    const { email, password,role } = req.body;
    try {
      const user = await UserModel.findByEmail(email,role);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        console.log('Invalid email or password');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign(
        { userId: user.user_id, name: user.firstName,email:email ,type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({success: true, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({success: false, message: error.message });
    }
  }
  static async Adminlogin(req, res) {
    const { email, password,role } = req.body;
    try {
      const user = await UserModel.findByEmail(email,role);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        console.log('Invalid email or password');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign(
        { userId: user.user_id, name: user.firstName,email:email ,type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({success: true, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({success: false, message: error.message });
    }
  }
  static async Brandlogin(req, res) {
    const { email, password,role } = req.body;
    try {
      const user = await UserModel.findByEmail(email,role);
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign(
        { userId: user.user_id, name: user.firstName,email:email , type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({success: true, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({success: false, message: error.message });
    }
  }
  static async logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({success: true, message: 'Logout successful' });
  }
}

module.exports = AuthController;