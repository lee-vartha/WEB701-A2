// referencing the product model
const Product = require('../models/Product');
  
// export controller function - adding the product
exports.addProduct = async (req, res) => {
  try {
    const {name, vendor, tokens, description, expiry, image} = req.body;

    if (!name || !vendor || !tokens || !description || !expiry || !image ) {
      return res.status(400).json({msg: "Please fill all required fields."});
    }
    // if the user role is not donor, return 403
    if (req.user.role !== 'donor') return res.status(403).json({ msg: "Only donors can add products" });

    const product = await Product.create({ name, vendor, tokens, description, expiry, image, donorId: req.user._id, });

    // json response with the product
    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

// export controller function - getting the products
exports.getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.donorId) {
      filter.donorId = req.query.donorId;
    }

    // populate the donor field with name and email
    const products = await Product.find(filter).populate('donorId', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
