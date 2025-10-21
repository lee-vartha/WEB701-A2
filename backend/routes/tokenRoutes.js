// referencing express
const express = require('express');
// defining the earnTokens and spendTokens functions from tokenController
const { earnTokens, spendTokens } = require('../controllers/tokenController');
// referencing the protect middleware to secure the routes
const { protect } = require('../middleware/authMiddleware');
// creating the router
const router = express.Router();

// posting to earn and spend token routes
router.post('/earn', protect, earnTokens);
router.post('/spend', protect, spendTokens);

// exporting the router
module.exports = router;
