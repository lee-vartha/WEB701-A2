// referencing express
const express = require('express');
// defining the addProduct and getProducts functions from productController
const { addProduct, getProducts } = require('../controllers/productController');
// referencing the protect middleware to secure the routes
const { protect } = require('../middleware/authMiddleware');
// creating the router
const router = express.Router();

// posting to addProduct and getting products routes
router.post('/', protect, addProduct);
router.get('/', getProducts);


// exporting the router
module.exports = router;
