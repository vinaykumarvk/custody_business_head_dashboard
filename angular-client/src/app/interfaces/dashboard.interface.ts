
export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersMTD: number;
  date: string;
}

export interface CustomerGrowth {
  date: string;
  totalCustomers: number;
  newCustomers: number;
}

export interface CustomerSegment {
  segmentName: string;
  percentage: string;
}

export interface TradingVolume {
  date: string;
  volume: string;
}

export interface AucHistory {
  date: string;
  equity: string;
  fixedIncome: string;
  mutualFunds: string;
  others: string;
}

export interface AucMetrics {
  totalAuc: string;
  equity: string;
  fixedIncome: string;
  mutualFunds: string;
  others: string;
  growth: string;
}

export interface Income {
  incomeMTD: string;
  outstandingFees: string;
  growth: string;
}

export interface TopCustomer {
  name: string;
  customerType: string;
  revenue: string;
  assets: string;
  changePercent: string;
}
