const express = require('express');
const AuthController = require('../controllers/authController');
const multer = require('multer');
const router = express.Router();
// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/signup',upload.single('file'), AuthController.signup);
router.post('/influencer/login', AuthController.Influencerlogin);
router.post('/admin/login', AuthController.Adminlogin);
router.post('/brand/login', AuthController.Brandlogin);
router.post('/logout', AuthController.logout);
module.exports = router;