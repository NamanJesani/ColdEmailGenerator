const express = require('express');
//const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
//app.use(cors());

// Sample route
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});