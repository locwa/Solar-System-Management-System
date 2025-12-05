import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import sequelize from './config/database'; // Corrected import path
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes'; // Added import for citizenRoutes

const app = express();

// Enable CORS with explicit headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ssms-websys.netlify.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});
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
app.use('/api/citizens', citizenRouter); // Added citizen routes

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(4000, () => console.log("Server running on port 4000"));
});
