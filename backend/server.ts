import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import sequelize from './config/database';
import authRouter from './routes/authRoutes';
import planetRouter from './routes/planetRoutes';
import citizenRouter from './routes/citizenRoutes';

const app = express();

// 🔥 MUST BE FIRST — Add headers but DO NOT block OPTIONS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://ssms-websys.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// 🔥 Let CORS handle the OPTIONS response
app.use(cors({
    origin: "https://ssms-websys.netlify.app",
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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

app.use('/api/auth', authRouter);
app.use('/api/planets', planetRouter);
app.use('/api/citizens', citizenRouter);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(4000, () => console.log("Server running on port 4000"));
});
