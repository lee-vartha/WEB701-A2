const express = require ("express");
const Groq = require ("groq-sdk");

const router = express.Router();
const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

router.post("/", async (req, res) => {
    try {
        const input = req.body.message;

        if (!input || typeof input !== "string") {
            return res.status(400).json({reply: "Can you repeat that?"});
        }

        const message = input.trim();

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            max_tokens: 120,
            temperature: 0.5,
            messages: [
                {
                    role: "system", content: `You are Nosh Assistant, a friendly support chatbot for the Nelson charity token platform. 
                    
                    Rules:
                    - You help beneficiaries and donors. 
                    - Keep answers short and clear (1-2 sentences)
                    - Never give long essays.
                    - Stay within the topic of the website: donors, beneficiaries, tokens, reservations, accounts, product registration and basic help.
                    - If user asks anything unrelated to the platform (politics, maths, random facts), redirect back to the website
                    - Never speculate outside the systems features.
                    - If you receive a message from the system that sounds like an error (e.g., "Not enough tokens", "Failed to submit meal"), or if a message starts with "SYSTEM_ERROR:', this is not a normal chat.
                    It is an internal system message describing an error which happened in the UI. respond with a short explanation of the likely cause and how the user can fix it inside the platform.
                    - Donating happens by submitting a meal through using your logged in Donor account. 
                    - Only beneficiaries can purchase meals
                    - If user needs to reset password, they go into their account settings.
                    - donors can usually be vendors from restaurants, cafes, food carts etc.
                    - beneficiaries can be anyone, but benefits those who are late night workers who cant get to stores on time
                    - if the user is confused on how to use the website, just explain what the point is (briefly), say how if you are in need of a meal, simply find a meal of interest and use tokens. briefly explain tokens and how it works
                    - if required, explain how tokens are reset, how many is given a week and what can you do to get admins to allocate them
                    `},
                {role: "user", content: message}
            ],
        });

        const reply = completion.choices[0]?.message?.content || "I couldn't understand that.";
        res.json({reply});

    } catch (err) {
        console.error("AI Error:", err)
        res.status(500).json({reply: "Server error."});
    }
});

module.exports = router;