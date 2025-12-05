import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
const cors = require('cors');
import sequelize from './config/database'; // Corrected import path
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes'; // Added import for citizenRoutes

const app = express();

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://ssms-websys.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(200);
});

// Enable CORS with explicit headers for preflight requests
app.use(cors({
  origin: "https://ssms-websys.netlify.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Enable session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // set true if HTTPS in production
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
