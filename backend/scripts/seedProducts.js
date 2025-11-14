const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");


dotenv.config({path: "../.env"});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI missing")
    process.exit(1);
}

const sampleMeals = [
    {
        id: 1,
        name: "Grilled Chicken Wrap",
        vendor: "The Deli Counter",
        tokens: 1,
        time: "10 mins",
        image: "/meals/grilled-wrap.png",
    },
    {
        id: 2,
        name: "Pizza",
        vendor: "Soprano's Pizzeria",
        tokens: 2,
        time: "30 mins",
        image: "/meals/pizza.png",

    },
    {
        id: 3,
        name: "Spaghetti Bolognese",
        vendor: "Bella Italia",
        tokens: 1,
        time: "15 mins",
        image: "../assets/spaghetti.png",
    },
];

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(sampleMeals);
        console.log("Database seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed", err);
        process.exit(1);
    }
})();