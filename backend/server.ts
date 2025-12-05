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
app.use(cors({
  origin: ['https://ssms-websys.netlify.app', 'http://localhost:5173', 'https://solar-system-management-system.vercel.app'], // Allow Netlify, localhost, and Vercel
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.use(express.json());

// Enable session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
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
