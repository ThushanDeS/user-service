const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.getUser = (req, res) => {
  res.json({ message: 'getUser' });
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  // rudimentary uniqueness check via User model
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'user already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    id: uuidv4(),
    email,
    passwordHash,
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || '',
    createdAt: new Date().toISOString(),
  });

  // ensure userId exists for compatibility with other modules
  if (!user.userId) user.userId = user.id;

  await user.save();

  // Do NOT return password hash in response
  const safe = { ...user };
  delete safe.passwordHash;

  return res.status(201).json({ user: safe });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const secret = process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });

  const safe = { ...user };
  delete safe.passwordHash;

  return res.json({ user: safe, token });
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('Searching for user with userId:', userId); // Debug log
        
        // Search by the custom 'userId' field, not MongoDB '_id'
        const user = await User.findOne({ userId: userId });
        
        if (!user) {
            console.log('User not found with userId:', userId);
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        console.log('User found:', user.email);
        
        // Return user data without sensitive info
        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    loyaltyPoints: user.loyaltyPoints,
                    loyaltyTier: user.loyaltyTier,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user',
            error: error.message
        });
    }
};
