// referencing express and the User model
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const {name, email, password} = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({msg: 'User not found'});

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({msg: 'Profile updated', user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }});
  } catch (err) {
    res.status(500).json({msg: "Server error"});
  }
});

// POST new user
router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.json(savedUser);
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({msg: 'User deleted'});
});

module.exports = router;
