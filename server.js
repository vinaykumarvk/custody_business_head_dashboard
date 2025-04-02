import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import http from 'http';

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_XLWRD5TeCQZ4@ep-proud-snow-a6uythny.us-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  release();
});

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

// List all tables endpoint
app.get('/api/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    res.json({
      message: 'Database tables:',
      tables: result.rows.map(row => row.table_name),
      status: 'success'
    });
  } catch (error) {
    console.error('Error listing tables:', error);
    res.status(500).json({
      message: 'Error listing database tables',
      error: error.message,
      status: 'error'
    });
  }
});

// Test database connection
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

// Utility function to convert snake_case to camelCase and handle type conversions
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      let value = obj[key];
      
      // Convert numeric strings to numbers
      if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }
      
      result[camelKey] = toCamelCase(value);
      return result;
    }, {});
  }
  return obj;
};

// Customer metrics endpoint
app.get('/api/customer-metrics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer_metrics LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    
    const transformedData = toCamelCase(result.rows[0]);
    transformedData.createdAt = new Date(); // Add createdAt field
    
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM customer_growth ORDER BY date DESC LIMIT 12');
    const transformedData = result.rows.map(row => ({
      id: row.id,
      date: row.date,
      customers: row.total_customers,
      newCustomers: row.new_customers,
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM customer_segments');
    const transformedData = result.rows.map(row => ({
      id: row.id,
      segment: row.segment_name,
      count: Math.round((row.percentage / 100) * 1000), // Convert percentage to count
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM trading_volume ORDER BY date DESC LIMIT 30');
    const transformedData = result.rows.map(row => ({
      ...toCamelCase(row),
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM auc_history ORDER BY date DESC LIMIT 30');
    const transformedData = result.rows.map(row => ({
      ...toCamelCase(row),
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM auc_metrics LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    const transformedData = {
      ...toCamelCase(result.rows[0]),
      createdAt: new Date()
    };
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM income LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    const transformedData = {
      ...toCamelCase(result.rows[0]),
      createdAt: new Date()
    };
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM income_by_service');
    const transformedData = result.rows.map(row => ({
      ...toCamelCase(row),
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query('SELECT * FROM income_history ORDER BY date DESC LIMIT 12');
    const transformedData = result.rows.map(row => ({
      ...toCamelCase(row),
      createdAt: new Date()
    }));
    res.json(transformedData);
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
    const result = await pool.query(`
      SELECT 
        id,
        name,
        customer_type,
        revenue,
        assets,
        change_percent
      FROM top_customers
      ORDER BY revenue DESC, assets DESC
      LIMIT 10
    `);
    
    // Transform the data to match frontend interface
    const transformedData = result.rows.map(customer => ({
      ...toCamelCase(customer),
      createdAt: new Date()
    }));
    
    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ 
      message: 'Error fetching top customers',
      error: error.message
    });
  }
});

// Temporary endpoint to check table schema
app.get('/api/check-top-customers-schema', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'top_customers'
      ORDER BY ordinal_position;
    `);
    
    res.json({
      message: 'Top customers table schema:',
      columns: result.rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error checking table schema:', error);
    res.status(500).json({
      message: 'Error checking table schema',
      error: error.message,
      status: 'error'
    });
  }
});

// Temporary endpoint to check customer_history schema
app.get('/api/check-customer-history-schema', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'customer_history'
      ORDER BY ordinal_position;
    `);
    
    res.json({
      message: 'Customer history table schema:',
      columns: result.rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error checking table schema:', error);
    res.status(500).json({
      message: 'Error checking table schema',
      error: error.message,
      status: 'error'
    });
  }
});

// Temporary endpoint to check monthly_customer_data schema
app.get('/api/check-monthly-data-schema', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'monthly_customer_data'
      ORDER BY ordinal_position;
    `);
    
    res.json({
      message: 'Monthly customer data table schema:',
      columns: result.rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error checking table schema:', error);
    res.status(500).json({
      message: 'Error checking table schema',
      error: error.message,
      status: 'error'
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
  console.log(`Available at http://127.0.0.1:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the existing process.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});