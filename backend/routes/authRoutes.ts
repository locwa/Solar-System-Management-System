import express from 'express';
const router = express.Router();
const auth = require('../controllers/authController');
const sessionAuth = require('../middleware/sessionAuth');
const roleAuth = require('../middleware/roleAuth');

router.post('/login', auth.login);
router.post('/logout', sessionAuth, auth.logout);

// Test protected route
router.get('/me', sessionAuth, (req, res) => {
  res.json({ sessionUser: (req as any).session.user });
});


// Register
router.post('/register', auth.register);

// CITIZEN ROUTE
router.get('/citizen-area', 
  sessionAuth,
  roleAuth(["Citizen"]), 
  (req, res) => {
    res.json({ message: "Welcome Citizen!" });
  }
);

// PLANETARY ROUTE
router.get('/leader-area',
  sessionAuth,
  roleAuth(["Planetary Leader"]), 
  (req, res) => {
    res.json({ message: "Welcome Planetary Leader!" });
  }
);

// GALACTIC ROUTE
router.get('/galactic-area',
  sessionAuth,
  roleAuth(["Galactic Leader"]), 
  (req, res) => {
    res.json({ message: "Welcome Galactic Leader!" });
  }
);


module.exports = router;

