const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./API/routes/authRoutes');
const doubtRoutes = require('./API/routes/doubtRoutes');
const sessionRequestRoutes = require('./API/routes/sessionRequestRoutes');
const sessionRoutes = require('./API/routes/sessionRoutes');
const adminRoutes = require('./API/routes/adminRoutes');
const instructorRoutes = require('./API/routes/instructorRoutes');
const commentRoutes = require('./API/routes/commentRoutes');
const roadmapRoutes = require('./API/routes/roadmapRoutes');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL || ''] }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/session-requests', sessionRequestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/notifications', require('./API/routes/notificationRoutes'));

module.exports = app;