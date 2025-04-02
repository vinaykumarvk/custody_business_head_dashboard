const express = require('express');
const { Pool } = require('@neondatabase/serverless');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Test database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Server is running!',
      time: result.rows[0].now,
      status: 'success'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Error connecting to database',
      error: error.message,
      status: 'error'
    });
  }
});

// Customer metrics endpoint
app.get('/api/customer-metrics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_metrics LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    res.status(500).json({ 
      message: 'Error fetching customer metrics',
      error: error.message
    });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('<h1>Custody Dashboard API</h1><p>Server is running</p><p>Try <a href="/api/test">/api/test</a> or <a href="/api/customer-metrics">/api/customer-metrics</a></p>');
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available at http://0.0.0.0:${PORT}`);
});