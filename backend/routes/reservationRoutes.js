const express = require('express');
const router = express.Router();
const {protect, authorize} = require('../middleware/authMiddleware');
const {createReservation, getReservations} = require('../controllers/reservationController');
const Reservation = require('../models/Reservation');

router.post('/', protect, createReservation);
router.get('/', protect, getReservations);

router.post("/reserve", authorize, async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({msg: "Product not found"});

        const ticket = await Reservation.create({
            userId: req.user.id,
            productId: productId,
        });

        return res.json({
            msg: "Reservation successful",
            ticketId: ticket._id
        });
    } catch (err) {
        res.status(500).json({msg: "Server error"});
    }
})

router.get("/donor/:donorId", protect, authorize("donor"), async (req, res) => {
    try {
        const donorId = req.params.donorId;

        const reservations = await Reservation.find()
        .populate("userId", "name email")
        .populate("productId", "name vendor donorId expiresAt tokensUsed")
        .lean();

        const filtered = reservations.filter(
            reservation => reservation.productId?.donorId?.toString() === donorId
        );

        res.json(filtered);
    } catch (err) {
        res.status(500).json({msg: "Server error"});
    }
})
module.exports = router;