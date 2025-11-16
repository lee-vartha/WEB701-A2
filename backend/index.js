require("dotenv").config();

console.log("Groq key:", process.env.GROQ_API_KEY);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/userRoutes'); 
const chatRoutes = require("./routes/chatRoute");

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes); 
app.use("/api/chat", chatRoutes);

// db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("");
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));
