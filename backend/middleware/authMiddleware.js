// refering middleware (json web tokens & user model)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// creating 'protect', which is used to protect routes which require auth
const protect = async (req, res, next) => {
    // requesting the authorization token
    // by extracting this header, the server can access the token and use it to verify the users identity
    // if the header is missing auth will fail
    let token = req.headers.authorization;
    // if theres no token at all or theres no token that includes bearer, create error
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({msg: "No token, authorization denied"});
    }
    
    
    try {
        
        // verifying and decoding a JWT using the jsonwebtoken library
        // the token variable is expected to be a string in the format 'Bearer <token>'
        // // the token split part splits the string by spaces and extracts the actual token part
        // // the jwt.verify function checks the tokens validity using the secret key
        // if the token is valid its decoded payload (users ID) is stored in the 'decoded' variable
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({msg: "Token isnt valid"});
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        console.log("Authorize check => Roles allowed:", roles);
        console.log("req.user data:", req.user);

        if (!req.user) {
            return res.status(401).json({msg: "Not authenticated. (authMiddleware.js)"});
        }

        if (!roles.includes(req.user.role)) {
            console.log("Access denied -> user role:", req.user.role);
            return res.status(403).json({msg: "Access denied."});
        }

        next();
        console.log("Authorized user:", req.user);
    }
}

module.exports = {protect, authorize}
