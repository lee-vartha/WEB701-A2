// referencing express
const express = require('express');
// defining the earnTokens and spendTokens functions from tokenController
const { earnTokens, spendTokens, allocateTokens } = require('../controllers/tokenController');
// referencing the protect middleware to secure the routes
const { protect, authorize } = require('../middleware/authMiddleware');
// creating the router
const router = express.Router();

const Reservation = require('../models/Reservation');
// posting to earn and spend token routes
router.post('/earn', protect, earnTokens);
router.post('/spend', protect, spendTokens);
router.post('/allocate', protect, authorize('admin'), allocateTokens);


router.post("/accept", protect, authorize("donor"), async (req, res) => {
    try {
        const {ticketId} = req.body;

        if (!ticketId) return res.status(404).json({msg: "Invalid Ticket"});

        const reservation = await Reservation.findOne({ticketId})

        if (!reservation) return res.status(404).json({msg: "Invalid or unknown QR code"});

        if (reservation.status !== "active") return res.status(400).json({msg: "QR code used already"});

        reservation.status = "benefited";
        await reservation.save();

        await Product.findByIdAndUpdate(
            reservation.productId,
            {status: "expired"}
        );
        res.json({msg: "Meal Collected!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Server error"});
    }
})
// exporting the router
module.exports = router;
