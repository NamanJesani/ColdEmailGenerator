// env variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const connectDB = require('./config/db');

// connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);




// Sample route
app.get('/', (req, res) => {
   res.send('Hello, World!');
 });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});