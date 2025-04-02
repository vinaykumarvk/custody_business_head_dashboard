import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_XLWRD5TeCQZ4@ep-proud-snow-a6uythny.us-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    // Read and execute schema.sql
    const schema = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema created successfully');

    // Insert sample data
    await pool.query(`
      INSERT INTO customer_metrics (total_customers, active_customers, total_customers_growth, active_customers_growth, retention_rate, acquisition_rate)
      VALUES (1000, 800, 5.2, 4.8, 85.0, 7.5)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO customer_growth (date, total_customers, active_customers)
      VALUES 
        (CURRENT_DATE - INTERVAL '30 days', 950, 750),
        (CURRENT_DATE - INTERVAL '20 days', 975, 775),
        (CURRENT_DATE - INTERVAL '10 days', 990, 790),
        (CURRENT_DATE, 1000, 800)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO customer_segments (segment_name, customer_count)
      VALUES 
        ('Enterprise', 300),
        ('Mid-Market', 400),
        ('Small Business', 300)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO trading_volume (date, volume)
      VALUES 
        (CURRENT_DATE - INTERVAL '30 days', 1000000),
        (CURRENT_DATE - INTERVAL '20 days', 1200000),
        (CURRENT_DATE - INTERVAL '10 days', 1500000),
        (CURRENT_DATE, 1800000)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO auc_history (date, total_auc)
      VALUES 
        (CURRENT_DATE - INTERVAL '30 days', 5000000000),
        (CURRENT_DATE - INTERVAL '20 days', 5500000000),
        (CURRENT_DATE - INTERVAL '10 days', 6000000000),
        (CURRENT_DATE, 6500000000)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO auc_metrics (total_auc, growth)
      VALUES (6500000000, 8.5)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO income (total_income, growth_rate)
      VALUES (25000000, 12.5)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO income_by_service (service_name, amount)
      VALUES 
        ('Custody', 15000000),
        ('Trading', 5000000),
        ('Advisory', 5000000)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO income_history (date, amount)
      VALUES 
        (CURRENT_DATE - INTERVAL '30 days', 20000000),
        (CURRENT_DATE - INTERVAL '20 days', 22000000),
        (CURRENT_DATE - INTERVAL '10 days', 23500000),
        (CURRENT_DATE, 25000000)
      ON CONFLICT DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO top_customers (name, customer_type, revenue, assets, change)
      VALUES 
        ('Acme Corp', 'Enterprise', 5000000, 100000000, 15.5),
        ('TechStart Inc', 'Mid-Market', 3000000, 50000000, 8.2),
        ('Global Industries', 'Enterprise', 4500000, 90000000, 12.3),
        ('Local Business Co', 'Small Business', 1000000, 20000000, 5.7),
        ('Innovation Labs', 'Mid-Market', 2500000, 40000000, 9.8)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 