// referencing mongoose (mongo db)
const mongoose = require('mongoose');

// schema for products - includes name of product (e.g., pizza), description (e.g, cheese and pepperoni), cost (e.g., 1 token) and donor (user who added it)
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    vendor: {type: String, required: true},
    tokens: {type: Number, default: 1},
    time: {type: String, default: "15 mins"},
    image: {type: String},
    status: {type: String, enum: ["active", "reserved", "expired"], default: "active"},
    donorId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reservedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

// exporting the model so other files can use it
module.exports = mongoose.model('Product', productSchema);