import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authenticateSession } from '../middleware/sessionAuth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateSession, getMe); // Protected route

export default router;
