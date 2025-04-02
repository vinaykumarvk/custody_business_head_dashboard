// Customer Metrics interface
export interface CustomerMetrics {
  id: number;
  totalCustomers: number;
  activeCustomers: number;
  totalCustomersGrowth: number;
  activeCustomersGrowth: number;
  retentionRate: number;
  acquisitionRate: number;
  createdAt?: Date;
}

// Customer Growth interface
export interface CustomerGrowth {
  id: number;
  date: Date | string;
  customers: number;
  newCustomers: number;
  createdAt?: Date;
}

// Customer Segment interface
export interface CustomerSegment {
  id: number;
  segment: string;
  count: number;
  createdAt?: Date;
}

// Trading Volume interface
export interface TradingVolume {
  id: number;
  date: Date | string;
  volume: number;
  createdAt?: Date;
}

// AUC History interface
export interface AucHistory {
  id: number;
  date: Date | string;
  auc: number;
  createdAt?: Date;
}

// AUC Metrics interface
export interface AucMetrics {
  id: number;
  totalAuc: number;
  equity: number;
  fixedIncome: number;
  mutualFunds: number;
  others: number;
  growth: number;
  createdAt?: Date;
}

// Income interface
export interface Income {
  id: number;
  totalIncome: number;
  feesIncome: number;
  tradingIncome: number;
  otherIncome: number;
  growthRate: number;
  createdAt?: Date;
}

// Income by Service interface
export interface IncomeByService {
  id: number;
  serviceName: string;
  amount: number;
  createdAt?: Date;
}

// Income History interface
export interface IncomeHistory {
  id: number;
  date: Date | string;
  income: number;
  createdAt?: Date;
}

// Top Customer interface
export interface TopCustomer {
  id: number;
  name: string;
  customerType: string;
  revenue: number;
  assets: number;
  changePercent: number;
  createdAt?: Date;
}

// Monthly Customer Data interface
export interface MonthlyCustomerData {
  id: number;
  month: Date | string;
  institutional: number;
  corporate: number;
  hni: number;
  funds: number;
  createdAt?: Date;
}

// Customer History interface
export interface CustomerHistory {
  id: number;
  date: Date | string;
  newCustomers: number;
  lostCustomers: number;
  createdAt?: Date;
}
