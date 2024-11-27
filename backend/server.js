const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 5000;

// Enable CORS to allow the React app to communicate with the backend
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Endpoint to fetch stock data
app.get('/api/stock_data', (req, res) => {
  const query = 'SELECT * FROM stock_data'; // Replace 'stock_data' with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stock data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results); // Send the data as a JSON response
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
