const User = require('../models/User'); // referencing user model
const jwt = require('jsonwebtoken'); // referencing jsonwebtoken
const bcrypt = require('bcryptjs'); // referencing bcryptjs

// creating a signed JWT containing the users ID, using the secret key - sets the token to expire after a week
// allows the server to verify the identify of users
const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});

// registering a new user
exports.register = async (req, res) => {
    let {name, email, password, role} = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({msg: "Missing fields"});
    }

    email = email.toLowerCase(); 
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({msg: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
        const startingBalance = role === 'beneficiary' ? 5: 0;

    const user = await User.create({
        name, email, password: hashedPassword, role, tokenBalance: startingBalance
    });

    res.json({
        token: generateToken(user._id),
        user: { 
            id: user._id, 
            name: user.name,
            email: user.email,
            role: user.role,
            tokenBalance: startingBalance
        },
    });
};


// logging in existing user
exports.login = async (req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({msg: "Invalid credentials"});

    const match = await bcrypt.compare(password, user.password);
    // if theres no match then the passwords incorrect and error is provided
    if (!match) return res.status(400).json({msg: "Invalid credentials"});

    const now = new Date();
    const lastLogin = user.LastLogin || new Date(0);

    if (now.toDateString() !== lastLogin.toDateString()) {
        user.tokens = (user.tokens || 0) + 1;
    }

    user.lastLogin = now;
    await user.save();

    const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.json({token: generateToken(user._id), user: {id: user._id, name: user.name, email, role: user.role}});
};

// getProfile is to get the user profile so that we can display it on the frontend
exports.getProfile = async (req, res) => {
    // finding the user by its ID
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
}