import express from 'express';
import postgres from 'postgres';
import http from 'http';

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

// Create database client
const sql = postgres(process.env.DATABASE_URL);

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await sql`SELECT NOW()`;
    res.json({
      message: 'Server is running!',
      time: result[0].now,
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
    const result = await sql`SELECT * FROM customer_metrics LIMIT 1`;
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    res.status(500).json({ 
      message: 'Error fetching customer metrics',
      error: error.message
    });
  }
});

// Customer growth endpoint
app.get('/api/customer-growth', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM customer_growth ORDER BY date ASC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching customer growth:', error);
    res.status(500).json({ 
      message: 'Error fetching customer growth',
      error: error.message
    });
  }
});

// Customer segments endpoint
app.get('/api/customer-segments', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM customer_segments`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    res.status(500).json({ 
      message: 'Error fetching customer segments',
      error: error.message
    });
  }
});

// Trading volume endpoint
app.get('/api/trading-volume', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM trading_volume ORDER BY date ASC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching trading volume:', error);
    res.status(500).json({ 
      message: 'Error fetching trading volume',
      error: error.message
    });
  }
});

// AUC history endpoint
app.get('/api/auc-history', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM auc_history ORDER BY date ASC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching AUC history:', error);
    res.status(500).json({ 
      message: 'Error fetching AUC history',
      error: error.message
    });
  }
});

// AUC metrics endpoint
app.get('/api/auc-metrics', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM auc_metrics LIMIT 1`;
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching AUC metrics:', error);
    res.status(500).json({ 
      message: 'Error fetching AUC metrics',
      error: error.message
    });
  }
});

// Income endpoint
app.get('/api/income', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM income LIMIT 1`;
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ 
      message: 'Error fetching income',
      error: error.message
    });
  }
});

// Income by service endpoint
app.get('/api/income-by-service', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM income_by_service`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching income by service:', error);
    res.status(500).json({ 
      message: 'Error fetching income by service',
      error: error.message
    });
  }
});

// Income history endpoint
app.get('/api/income-history', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM income_history ORDER BY date ASC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching income history:', error);
    res.status(500).json({ 
      message: 'Error fetching income history',
      error: error.message
    });
  }
});

// Top customers endpoint
app.get('/api/top-customers', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM top_customers ORDER BY revenue DESC`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ 
      message: 'Error fetching top customers',
      error: error.message
    });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send(`
    <h1>Custody Dashboard API</h1>
    <p>Server is running</p>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/api/test">/api/test</a> - Test connection</li>
      <li><a href="/api/customer-metrics">/api/customer-metrics</a> - Get customer metrics</li>
      <li><a href="/api/customer-growth">/api/customer-growth</a> - Get customer growth data</li>
      <li><a href="/api/customer-segments">/api/customer-segments</a> - Get customer segments</li>
      <li><a href="/api/trading-volume">/api/trading-volume</a> - Get trading volume data</li>
      <li><a href="/api/auc-history">/api/auc-history</a> - Get AUC history</li>
      <li><a href="/api/auc-metrics">/api/auc-metrics</a> - Get AUC metrics</li>
      <li><a href="/api/income">/api/income</a> - Get income data</li>
      <li><a href="/api/income-by-service">/api/income-by-service</a> - Get income by service</li>
      <li><a href="/api/income-history">/api/income-history</a> - Get income history</li>
      <li><a href="/api/top-customers">/api/top-customers</a> - Get top customers</li>
    </ul>
  `);
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available at http://0.0.0.0:${PORT}`);
});