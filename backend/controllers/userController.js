const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
  static async getMe(req, res) {
    try {
      const user = await UserModel.findByID(req.user.userId);
      res.status(200).json({
        userId: req.user.userId,
        name: user.firstName,
        email: user.email,
        type: user.user_type,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateEmail(req, res) {
    try {
      const { newEmail } = req.body;
      const user = await UserModel.findByEmail(req.user.email, req.user.type);

      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      // Update email in the database
      await UserModel.updateEmail(req.user.userId, newEmail);

      // Fetch the updated user
      const updatedUser = await UserModel.findByID(req.user.userId);

      // Check if updatedUser exists and has an email
      if (!updatedUser || !updatedUser.email) {
        throw new Error('Failed to fetch updated user or email not set');
      }

      // Generate new token
      const token = jwt.sign(
        { userId: req.user.userId, name: req.user.name, email: updatedUser.email, type: req.user.type },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Set the cookie
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

      // Send success response
      res.status(200).json({
        success: true,
        message: 'Email updated successfully',
        email: updatedUser.email,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // New method for searching users
  static async searchUsers(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const users = await UserModel.searchUsers(query, req.user.userId);
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Failed to search users' });
    }
  }
}

module.exports = UserController;