const User = require('../models/User'); // referencing user model
const Token = require('../models/Token'); // referencing token model
const Product = require('../models/Product'); // referencing product model

// gaining and earning tokens
exports.earnTokens = async (req, res) => {
    try {
        if (req.user.role !== 'beneficiary') return res.status(403).json({msg: "Only beneficiaries can earn tokens"});

        // declaring amount from req.body
         const {amount} = req.body;
        // adding amount to users balance and saving that to the database
         req.user.tokenBalance += amount;
         await req.user.save();

         const tokenRecord = await Token.create({user: req.user_id, amount, type: 'earn'});
         res.json({msg: "Tokens earned!", balance: req.user.tokenBalance, record: tokenRecord});

    } catch (err) {
        res.status(500).json({msg: err.message});
    }
}


exports.allocateTokens = async (req, res) => {
    try {
        const {userId, amount} = req.body;

        if (!userId || !amount) {
            return res.status(400).json({msg: 'User ID and token amount required'});
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({msg: 'User not found'});

        user.tokens = (user.tokens || 0) + Number(amount);
        await user.save();
        res.json({msg: `Allocated ${amount} tokens to ${user.name}`, tokens: user.tokens});
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server error'});
    }
}

// spending tokens
exports.spendTokens = async (req, res) => {
    try {
        // if the user isnt a beneficiary, then provide error
        if (req.user.role !== 'beneficiary') return res.status (403).json({msg: "Only beneficiaries can spend tokens"});

        // getting productId from req.body to find the product
        const {productId}  = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({msg: "Product not found"});

        // if the user doesnt have enough tokens to spend then provide popup error
        if (req.user.tokenBalance < product.cost) return res.status(400).json({msg: "Not enough tokens!"});

        // token balance is dropped and saved to database to update it (if successful)
        req.user.tokenBalance -= product.cost;
        await req.user.save()

        // creating a token record for spending tokens on a product
        const tokenRecord = await Token.create({user: req.user._id, amount: product.cost, type: 'spend', product: productId});
        res.json({msg: `Bought ${product.name}`, balance: req.user.tokenBalance, record: tokenRecord});
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
}