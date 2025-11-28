require('dotenv').config();
import express from 'express';
const session = require('express-session');
const sequelize = require('./config/db');

const app = express();
app.use(express.json());

// Enable session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set true if HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(4000, () => console.log("Server running on port 4000"));
});
