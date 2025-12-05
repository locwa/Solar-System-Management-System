import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
const cors = require('cors'); 
import sequelize from './config/database';
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes';
import proposalRouter from './routes/proposalRoutes'; 

const app = express();

app.use(cors({
  origin: ['https://ssms-websys.netlify.app', 'http://localhost:5173', 'https://solar-system-management-system.vercel.app'], // Allow Netlify, localhost, and Vercel
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 
  }
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/planets', planetRouter);
app.use('/api/citizens', citizenRouter);
app.use('/api/proposals', proposalRouter); 

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(4000, () => console.log("Server running on port 4000"));
});
