// referencing express
const express = require('express');
// defining the addProduct and getProducts functions from productController
const { addProduct, getProducts } = require('../controllers/productController');
// referencing the protect and authorization middleware to secure the routes
const { protect, authorize } = require('../middleware/authMiddleware');
// creating the router
const Product = require('../models/Product');

const router = express.Router();

// posting to addProduct and getting products routes
router.post('/', protect, authorize('donor'), addProduct);
router.get('/', getProducts);

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({msg: 'Product deleted'});
});

// exporting the router
module.exports = router;
