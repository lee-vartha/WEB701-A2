// importing mongoose (mongo db)
const mongoose = require('mongoose');

// schema for tokens - includes user (who earned/spent the tokens), amount (number of tokens), type (earn or spend), product (if spent, which product)
const tokenSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    type: {type: String, enum: ['earn', 'spend'], required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
}, {timestamps: true});

// exporting to module to be used for other files
module.exports = mongoose.model('Token', tokenSchema);
