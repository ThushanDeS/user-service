// src/routes/loyaltyRoutes.js
const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');

// Get user's loyalty points
router.get('/points/:userId', loyaltyController.getPoints);

// Get transaction history
router.get('/history/:userId', loyaltyController.getTransactionHistory);

// Add points (called by Booking Service)
router.post('/points/add', loyaltyController.addPoints);

// Redeem points
router.post('/points/redeem', loyaltyController.redeemPoints);

module.exports = router;