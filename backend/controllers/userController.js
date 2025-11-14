const User = require('../models/User'); // referencing user model
const jwt = require('jsonwebtoken'); // referencing jsonwebtoken
const bcrypt = require('bcryptjs'); // referencing bcryptjs

// creating a signed JWT containing the users ID, using the secret key - sets the token to expire after a week
// allows the server to verify the identify of users
const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});

// registering a new user
exports.register = async (req, res) => {
    let {name, email, password, role} = req.body;

    // validation for any missing fields
    // if theres none of these fields then return error 400
    if (!name || !email || !password || !role) {
        return res.status(400).json({msg: "Missing fields"});
    }

    email = email.toLowerCase(); // converting email to lowercase so that there are no duplicates
    // ensuring that donor@gmail.com is the same as Donor@Gmail.com so when system is comparing its easier

    // finding existing user in case the email being inputted has already been created in the system
    // an existing user is found through looking in the database (focusing on the 'email' field to figure this)
    const existingUser = await User.findOne({email});
    // if it is, give back error saying the user already exists
    if (existingUser) {
        return res.status(400).json({msg: "User already exists"});
    }

    // using bcrypt library to hash the users password before storing it in the database - takes two arguments (password and 10) 
    // 10 is salt rounds, which determines how many times the hashing algorithm is used (10 means its used ten times, making the has more secure)
    // using await makes sure te code waits for that hashing process is done before doing anything else, since hashing is an async oepration
    // resulting password is stored in the 'hashedPassword' variable
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // sets the value of the starting variable based on the role -- if the role variable equals to 'beneficiary', then itll be set with 5 tokens
    // if otherwise, then 0 (meaning that the user is a donor)
    // this is a way to assign different starting token amounts based on the user and reflects user-access benefits
    const startingBalance = role === 'beneficiary' ? 5: 0;


    // creates a new user record in the db, which is provided by mongoDB (mongoose)
    // methods called with an object containing the users name, email and hashed password, role and token balance (set to the value of the previous function)
    // await is used to ensure the code waits for the database operation to complete before it moves on
    const user = await User.create({
        name, email, password: hashedPassword, role, tokenBalance: startingBalance
    });

    // sends a JSON response back to the client after a user signs up properly
    // token meaning the actual JWT token - not money token.
    // the token encodes the users ID and is used for authetnication in further uses
    // the user object contains the usual user details and these values will be sent so the client can use them as needed
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

    
    // finding the user by email
    const user = await User.findOne({email});
    // if theres not a user that matches the email then provide error
    if (!user) return res.status(400).json({msg: "Invalid credentials"});

    // match is comparing password from body to hashed password in the database
    // using the bcrypt library to compare the users password with the hashed password stored in the database
    // bcrypt.compare function takes that plain password and the hashed password as arguments and double checks that they match
    // await is used to make sure the code waits for the async operation to be done before it moves on
    // if the passwords match, then it will continue
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

    // otherwise, generate a token and send back user data except password
    // sends a json response to client
    // token is the JWT token which encodes users IDs and is used for other requests
    // the user object contains user detail
    // this is used to ensure the server provides the client with the auth token and user information
    res.json({token: generateToken(user._id), user: {id: user._id, name: user.name, email, role: user.role}});
};

// getProfile is to get the user profile so that we can display it on the frontend
exports.getProfile = async (req, res) => {
    // finding the user by its ID
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
}