-- Create customer_metrics table
CREATE TABLE IF NOT EXISTS customer_metrics (
    id SERIAL PRIMARY KEY,
    total_customers INTEGER NOT NULL,
    active_customers INTEGER NOT NULL,
    total_customers_growth DECIMAL(5,2) NOT NULL,
    active_customers_growth DECIMAL(5,2) NOT NULL,
    retention_rate DECIMAL(5,2) NOT NULL,
    acquisition_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_growth table
CREATE TABLE IF NOT EXISTS customer_growth (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_customers INTEGER NOT NULL,
    active_customers INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_segments table
CREATE TABLE IF NOT EXISTS customer_segments (
    id SERIAL PRIMARY KEY,
    segment_name VARCHAR(50) NOT NULL,
    customer_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trading_volume table
CREATE TABLE IF NOT EXISTS trading_volume (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    volume DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create auc_history table
CREATE TABLE IF NOT EXISTS auc_history (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_auc DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create auc_metrics table
CREATE TABLE IF NOT EXISTS auc_metrics (
    id SERIAL PRIMARY KEY,
    total_auc DECIMAL(15,2) NOT NULL,
    growth DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
    id SERIAL PRIMARY KEY,
    total_income DECIMAL(15,2) NOT NULL,
    growth_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create income_by_service table
CREATE TABLE IF NOT EXISTS income_by_service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create income_history table
CREATE TABLE IF NOT EXISTS income_history (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create top_customers table
CREATE TABLE IF NOT EXISTS top_customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    customer_type VARCHAR(50) NOT NULL,
    revenue DECIMAL(15,2) NOT NULL,
    assets DECIMAL(15,2) NOT NULL,
    change DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 