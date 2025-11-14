const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {createReservation, getReservations} = require('../controllers/reservationController');

router.post('/', protect, createReservation);
router.get('/', protect, getReservations);


module.exports = router;