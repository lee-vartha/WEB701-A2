const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
// const userRoutes = require('./routes/userRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tokens', tokenRoutes);
// app.use('/api/users', userRoutes); 

// db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));
