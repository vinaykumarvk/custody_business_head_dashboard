import postgres from 'postgres';

// Function to test database connection
async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Create a new sql client
    const sql = postgres(process.env.DATABASE_URL);
    
    // Test the connection
    const result = await sql`SELECT NOW() as time`;
    
    console.log('Database connection successful!');
    console.log('Current database time:', result[0].time);
    
    // Close the connection
    await sql.end();
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('Database connection test completed successfully.');
    } else {
      console.error('Database connection test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
  });