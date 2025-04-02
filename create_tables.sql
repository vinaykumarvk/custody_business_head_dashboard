-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create customer metrics table
CREATE TABLE IF NOT EXISTS customer_metrics (
  id SERIAL PRIMARY KEY,
  total_customers INTEGER NOT NULL,
  active_customers INTEGER NOT NULL,
  new_customers_mtd INTEGER NOT NULL,
  date TIMESTAMP NOT NULL
);

-- Create customer growth table
CREATE TABLE IF NOT EXISTS customer_growth (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  total_customers INTEGER NOT NULL,
  new_customers INTEGER NOT NULL
);

-- Create customer segments table
CREATE TABLE IF NOT EXISTS customer_segments (
  id SERIAL PRIMARY KEY,
  segment_name TEXT NOT NULL,
  percentage NUMERIC NOT NULL
);

-- Create trading volume table
CREATE TABLE IF NOT EXISTS trading_volume (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  volume NUMERIC NOT NULL
);

-- Create AUC history table
CREATE TABLE IF NOT EXISTS auc_history (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  equity NUMERIC NOT NULL,
  fixed_income NUMERIC NOT NULL,
  mutual_funds NUMERIC NOT NULL,
  others NUMERIC NOT NULL
);

-- Create AUC metrics table
CREATE TABLE IF NOT EXISTS auc_metrics (
  id SERIAL PRIMARY KEY,
  total_auc NUMERIC NOT NULL,
  equity NUMERIC NOT NULL,
  fixed_income NUMERIC NOT NULL,
  mutual_funds NUMERIC NOT NULL,
  others NUMERIC NOT NULL,
  growth NUMERIC
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
  id SERIAL PRIMARY KEY,
  income_mtd NUMERIC NOT NULL,
  outstanding_fees NUMERIC NOT NULL,
  growth NUMERIC
);

-- Create income by service table
CREATE TABLE IF NOT EXISTS income_by_service (
  id SERIAL PRIMARY KEY,
  service_name TEXT NOT NULL,
  amount NUMERIC NOT NULL
);

-- Create income history table
CREATE TABLE IF NOT EXISTS income_history (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  amount NUMERIC NOT NULL
);

-- Create top customers table
CREATE TABLE IF NOT EXISTS top_customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  revenue NUMERIC NOT NULL,
  assets NUMERIC NOT NULL,
  change_percent NUMERIC NOT NULL
);

-- Create monthly customer data table
CREATE TABLE IF NOT EXISTS monthly_customer_data (
  id SERIAL PRIMARY KEY,
  month TIMESTAMP NOT NULL,
  institutional INTEGER NOT NULL,
  corporate INTEGER NOT NULL,
  hni INTEGER NOT NULL,
  funds INTEGER NOT NULL,
  active_customers INTEGER NOT NULL
);

-- Create customer history table
CREATE TABLE IF NOT EXISTS customer_history (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  total_customers INTEGER NOT NULL,
  new_customers INTEGER NOT NULL,
  churned_customers INTEGER NOT NULL,
  retention_rate NUMERIC NOT NULL,
  acquisition_cost NUMERIC NOT NULL,
  lifetime_value NUMERIC NOT NULL,
  institutional INTEGER NOT NULL DEFAULT 0,
  corporate INTEGER NOT NULL DEFAULT 0,
  hni INTEGER NOT NULL DEFAULT 0,
  funds INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  new INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 0
);