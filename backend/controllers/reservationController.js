const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createReservation = async (req, res) => {
    const userId = req.user.id; // protect() middleware
    const {productId} = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({message: "Unauthorized"});
        if (user.role !== 'beneficiary') {
            return res.status(403).json({message: "Only beneficiaries can reserve meals"});
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({message: "Product not found"});
        if (product.status !== 'active') {
            return res.status(400).json({message: "Meal not available"})
        }

        const cost = product.tokens || 1;
        if ((user.tokens || 0) < cost) {
            return res.status(400).json({message: 'Not enough tokens'});
        }

        if (user.role !== "beneficiary") {
        return res.status(403).json({msg: "Donors cannot reserve meals"});
}
        
        const session = await mongoose.startSession();
        let reservation; 
        await session.withTransaction(async () => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: userId, tokens: {$gte: cost}},
                {$inc: {tokens: -cost}},
                {new: true, session}
            );
            if (!updatedUser) throw new Error('Not enough tokens');

            const updatedProduct = await Product.findOneAndUpdate(
                {_id: productId, status: 'active'},
                {status: 'reserved', reservedBy: userId},
                {new: true, session}
            );
            if (!updatedProduct) throw new Error('Meal not available');
            
            reservation = await Reservation.create([{
                product: productId,
                beneficiary: userId,
                tokensUsed: cost,
                expiresAt: null
            }], {session});
        });

        session.endSession();
        user.tokens -= product.tokens;
        await user.save();

        return res.status(201).json({message: "Reserved", reservation: reservation[0], updatedTokens: user.tokens});
    } catch (err) {
        return res.status(400).json({message: err.message || "Reservation failed"});
    }
};

exports.getReservations = async (req, res) => {
    try {
        const list = await Reservation.find({beneficiary: req.user.id})
        .populate('product', 'name vendor tokens status')
        .sort('-createdAt');
        res.json(list);
    } catch (err) {
        res.status(500).json({message: "Failed to fetch reservations"});
    }
};