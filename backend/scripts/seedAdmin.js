require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


(async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected into MongoDB");

        const exists = await User.findOne({ email: 'admin@email.com'});
        if (!exists) {
            const hash = await bcrypt.hash('admin', 10)
            await User.create({ name: 'Admin', email: 'admin@email.com', password: hash, role: 'admin', tokens: 0});
            console.log("Admin user created");
        } else {
            console.log("Admin already exists");
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
})();