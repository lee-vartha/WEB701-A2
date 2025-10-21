// referencing mongoose (mongo db)
const mongoose = require('mongoose');

// schema for products - includes name of product (e.g., pizza), description (e.g, cheese and pepperoni), cost (e.g., 1 token) and owner (user who added it)
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    timeDuration: {type: String, required: true},
    description: {type: String},
    cost: {type: Number, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});

// exporting the model so other files can use it
module.exports = mongoose.model('Product', productSchema);