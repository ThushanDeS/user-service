// src/controllers/loyaltyController.js
const User = require('../models/User');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');

// Get user's loyalty points
exports.getPoints = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            status: 'success',
            data: {
                userId: user.userId,
                points: user.loyaltyPoints || 0,
                tier: user.loyaltyTier || 'bronze',
                totalBookings: user.totalBookings || 0
            }
        });
    } catch (error) {
        console.error('Get points error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get loyalty points',
            error: error.message
        });
    }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const transactions = await LoyaltyTransaction.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            status: 'success',
            data: {
                transactions: transactions || []
            }
        });
    } catch (error) {
        console.error('Get transaction history error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get transaction history'
        });
    }
};

// Add points (called by Booking Service)
exports.addPoints = async (req, res) => {
    try {
        const { userId, points, bookingReference, description } = req.body;

        if (!userId || !points) {
            return res.status(400).json({
                status: 'error',
                message: 'userId and points are required'
            });
        }

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Add points
        const oldPoints = user.loyaltyPoints || 0;
        user.loyaltyPoints = oldPoints + points;
        
        // Update loyalty tier based on points
        if (user.loyaltyPoints >= 10000) {
            user.loyaltyTier = 'platinum';
        } else if (user.loyaltyPoints >= 5000) {
            user.loyaltyTier = 'gold';
        } else if (user.loyaltyPoints >= 1000) {
            user.loyaltyTier = 'silver';
        }
        
        await user.save();

        // Create transaction record
        const transaction = new LoyaltyTransaction({
            userId: user.userId,
            bookingReference,
            points,
            type: 'earn',
            description: description || 'Points earned from booking',
            balance: user.loyaltyPoints
        });
        await transaction.save();

        res.json({
            status: 'success',
            message: 'Points added successfully',
            data: {
                userId: user.userId,
                previousPoints: oldPoints,
                pointsAdded: points,
                currentPoints: user.loyaltyPoints,
                tier: user.loyaltyTier,
                transactionId: transaction.transactionId
            }
        });
    } catch (error) {
        console.error('Add points error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add points',
            error: error.message
        });
    }
};

// Redeem points
exports.redeemPoints = async (req, res) => {
    try {
        const { userId, points, bookingReference, description } = req.body;

        if (!userId || !points) {
            return res.status(400).json({
                status: 'error',
                message: 'userId and points are required'
            });
        }

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.loyaltyPoints < points) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient points'
            });
        }

        // Deduct points
        const oldPoints = user.loyaltyPoints;
        user.loyaltyPoints -= points;
        
        // Update loyalty tier based on points
        if (user.loyaltyPoints >= 10000) {
            user.loyaltyTier = 'platinum';
        } else if (user.loyaltyPoints >= 5000) {
            user.loyaltyTier = 'gold';
        } else if (user.loyaltyPoints >= 1000) {
            user.loyaltyTier = 'silver';
        } else {
            user.loyaltyTier = 'bronze';
        }
        
        await user.save();

        // Create transaction record
        const transaction = new LoyaltyTransaction({
            userId: user.userId,
            bookingReference,
            points: -points,
            type: 'redeem',
            description: description || 'Points redeemed',
            balance: user.loyaltyPoints
        });
        await transaction.save();

        res.json({
            status: 'success',
            message: 'Points redeemed successfully',
            data: {
                userId: user.userId,
                previousPoints: oldPoints,
                pointsRedeemed: points,
                currentPoints: user.loyaltyPoints,
                tier: user.loyaltyTier,
                transactionId: transaction.transactionId
            }
        });
    } catch (error) {
        console.error('Redeem points error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to redeem points',
            error: error.message
        });
    }
};