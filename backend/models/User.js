// referencing mongoose (mongo db)
const mongoose = require('mongoose');

// the schema for users - includes name, email, password, role (donor or beneficiary), and token balance (default 5 tokens)
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['donor', 'beneficiary', 'admin'], required: true, default: 'beneficiary'},
    tokens: {type: Number, default: 5},
    lastLogin: {type: Date},
});

// exporting the module so other files can use it
module.exports = mongoose.model('User', userSchema);