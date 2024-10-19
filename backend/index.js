require('dotenv').config();
const express = require('express');
const cors = require('cors');
require("./config/db") // Import the DB connection function
const userRoutes = require('./Routes/userRoutes'); // Import user routes

const app = express();
const Port = process.env.PORT || 8000;

// Middleware
app.use(express.json()); // To parse JSON request body
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded form data
app.use(cors()); // Enable CORS

// Initialize MySQL connection


// Use user routes
app.use('/api', userRoutes); // Apply user routes with '/api' prefix

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
