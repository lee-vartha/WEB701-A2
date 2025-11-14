const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    beneficiary: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    tokensUsed: {type: Number, default: 1},
    status: {type: String, enum: ['active', 'canceled', 'benefited'], default: 'active'},
    expiresAt: {type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,}
}, {timestamps: true});

module.exports = mongoose.model('Reservation', reservationSchema);