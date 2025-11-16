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
        if (user.tokens < cost)
            return res.status(400).json({message: 'Not enough tokens'});

        const session = await mongoose.startSession();
        let reservation;

        await session.withTransaction(async () => {
            await User.findByIdAndUpdate(
                userId,
                { $inc: {tokens: -cost}},
                {new: true, session}
            );

            await Product.findByIdAndUpdate(
                productId,
                {status: "reserved", reservedBy: userId},
                {new: true, session}
            );
            
            reservation = await Reservation.create([{
            userId,
            productId,
            ticketId: new mongoose.Types.ObjectId().toString(),
            tokensUsed: cost,
            expiresOn: Date.now() + 15 * 60 * 1000,
        }], {session});

        });

        session.endSession();

        res.status(201).json({
            message: "Reserved",
            reservation: reservation[0],
            ticketId: reservation[0].ticketId,
            userId: req.user.id,
            expiresOn: reservation[0].expiresOn,
            updatedTokens: user.tokens - cost
        });

    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};

exports.getReservations = async (req, res) => {
    try {
        const list = await Reservation.find({userId: req.user.id})
        .populate('productId', 'name vendor tokens status')
        .sort('-createdAt');
        res.json(list);
    } catch (err) {
        res.status(500).json({message: "Failed to fetch reservations"});
    }
};