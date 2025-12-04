import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import sequelize from './config/database'; // Corrected import path
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';

const app = express();
app.use(express.json());

// Enable session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set true if HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/planets', planetRouter);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(4000, () => console.log("Server running on port 4000"));
});
