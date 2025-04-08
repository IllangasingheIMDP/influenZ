const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { google } = require('googleapis');
//const authRoutes = require('./routes/authRoutes');
const Redis = require('ioredis');
const pool = require('./db');  // Import the database connection pool
const app = express();
const youtubeRoutes = require('./routes/youtubeRoute');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const otpRoutes=require('./routes/otpRoute');
const influencerRoutes=require('./routes/influencerRoute');
const brandRoutes = require('./routes/brandRoute');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const campaignRoutes = require('./routes/campaignRoute');
const adminRoutes = require('./routes/adminRoute');
// CORS configuration to allow frontend communication
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
const redis = new Redis('redis://default:Skm7IBoJsWKIgPI4zk2rYQSjyS5s0Rhv@redis-10511.c232.us-east-1-2.ec2.redns.redis-cloud.com:10511');
app.locals.redis = redis;
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }));
// Routes
// app.use('/api/auth', authRoutes); cors
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/youtube',youtubeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/brand',brandRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/otp',otpRoutes);
app.use('/api/influencer',influencerRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/admin', adminRoutes);
pool.connect()
  .then(() => {
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);  // Exit the process if DB connection fails
  });