const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    ticketId: {type: String, required: true, unique: true},
    tokensUsed: {type: Number, default: 1},
    status: {type: String, enum: ['active', 'canceled', 'benefited'], default: 'active'},
    expiresOn: {type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,}
}, {timestamps: true});

module.exports = mongoose.model('Reservation', reservationSchema);