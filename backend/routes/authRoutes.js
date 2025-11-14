// referencing express
const express = require('express');
// importing the register, login and getProfile functions from userController
const { register, login, getProfile } = require('../controllers/userController');
// referencing the protect middleware to secure protected routes
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);  

// exporting the router
module.exports = router;
