import { 
  users, type User, type InsertUser,
  customerMetrics, type CustomerMetrics, type InsertCustomerMetrics,
  customerGrowth, type CustomerGrowth, type InsertCustomerGrowth,
  customerSegments, type CustomerSegments, type InsertCustomerSegments,
  tradingVolume, type TradingVolume, type InsertTradingVolume,
  aucHistory, type AucHistory, type InsertAucHistory,
  aucMetrics, type AucMetrics, type InsertAucMetrics,
  income, type Income, type InsertIncome,
  incomeByService, type IncomeByService, type InsertIncomeByService,
  incomeHistory, type IncomeHistory, type InsertIncomeHistory,
  topCustomers, type TopCustomers, type InsertTopCustomers,
  monthlyCustomerData, type MonthlyCustomerData, type InsertMonthlyCustomerData,
  customerHistory, type CustomerHistory, type InsertCustomerHistory
} from "@shared/schema";
import { eq, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create postgres client
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const client = postgres(connectionString);
const db = drizzle(client);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dashboard data methods
  getCustomerMetrics(): Promise<CustomerMetrics | undefined>;
  getCustomerGrowth(): Promise<CustomerGrowth[]>;
  getCustomerSegments(): Promise<CustomerSegments[]>;
  getTradingVolume(): Promise<TradingVolume[]>;
  getAucHistory(): Promise<AucHistory[]>;
  getAucMetrics(): Promise<AucMetrics | undefined>;
  getIncome(): Promise<Income | undefined>;
  getIncomeByService(): Promise<IncomeByService[]>;
  getIncomeHistory(): Promise<IncomeHistory[]>;
  getTopCustomers(): Promise<TopCustomers[]>;
  
  // Monthly customer data methods
  getMonthlyCustomerData(): Promise<MonthlyCustomerData[]>;
  createMonthlyCustomerData(data: InsertMonthlyCustomerData): Promise<MonthlyCustomerData>;
  
  // Customer history methods
  getCustomerHistory(): Promise<CustomerHistory[]>;
  createCustomerHistory(data: InsertCustomerHistory): Promise<CustomerHistory>;
  
  // Derived customer metrics methods
  calculateDerivedCustomerMetrics(dataPoints: MonthlyCustomerData[]): Promise<CustomerMetrics>;
  calculateCustomerGrowth(dataPoints: MonthlyCustomerData[]): Promise<CustomerGrowth[]>;
  calculateCustomerSegments(dataPoint: MonthlyCustomerData): Promise<CustomerSegments[]>;

  // Seed the database with initial mock data
  seedDatabase(): Promise<void>;
}

export class PostgresStorage implements IStorage {
  constructor() {}

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Dashboard data methods
  async getCustomerMetrics(): Promise<CustomerMetrics | undefined> {
    // Get customer history data
    const history = await this.getCustomerHistory();
    
    // If no history data, return from customerMetrics table (fallback)
    if (history.length === 0) {
      const result = await db.select().from(customerMetrics);
      return result[0];
    }
    
    // Get the most recent customer history record
    const latestData = history.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    // Return metrics based on latest customer history data
    return {
      id: 1,
      totalCustomers: latestData.totalCustomers,
      activeCustomers: latestData.active,
      newCustomersMTD: latestData.newCustomers,
      date: new Date()
    };
  }

  async getCustomerGrowth(): Promise<CustomerGrowth[]> {
    // Get data directly from customerGrowth table
    const result = await db.select().from(customerGrowth);
    
    // Sort by date, oldest first for consistent display
    return result.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getCustomerSegments(): Promise<CustomerSegments[]> {
    // Get customer history data
    const history = await this.getCustomerHistory();
    
    // If no history data, return from customerSegments table (fallback)
    if (history.length === 0) {
      const result = await db.select().from(customerSegments);
      return result;
    }
    
    // Get the most recent customer history record
    const latestData = history.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    // Calculate total
    const total = latestData.totalCustomers;
    
    if (total === 0) {
      throw new Error("Total customers cannot be zero");
    }
    
    // Calculate percentages from segments
    return [
      {
        id: 1,
        segmentName: "Institutional",
        percentage: ((latestData.institutional / total) * 100).toFixed(1)
      },
      {
        id: 2,
        segmentName: "Corporate",
        percentage: ((latestData.corporate / total) * 100).toFixed(1)
      },
      {
        id: 3,
        segmentName: "High Net Worth",
        percentage: ((latestData.hni / total) * 100).toFixed(1)
      },
      {
        id: 4,
        segmentName: "Funds",
        percentage: ((latestData.funds / total) * 100).toFixed(1)
      }
    ];
  }

  async getTradingVolume(): Promise<TradingVolume[]> {
    const result = await db.select().from(tradingVolume);
    return result;
  }

  async getAucHistory(): Promise<AucHistory[]> {
    const result = await db.select().from(aucHistory);
    return result;
  }

  async getAucMetrics(): Promise<AucMetrics | undefined> {
    // First check if we have existing data in the database
    const existingMetrics = await db.select().from(aucMetrics);
    if (existingMetrics.length > 0) {
      return existingMetrics[0];
    }
    
    // Get the AUC history data
    const aucHistoryData = await this.getAucHistory();
    
    // If no history data, return undefined
    if (aucHistoryData.length < 2) {
      return undefined;
    }
    
    // Sort by date, most recent first
    const sortedData = aucHistoryData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the most recent and previous month data
    const latestData = sortedData[0];
    const previousData = sortedData[1];
    
    // Calculate total AUC for latest month (sum of all segments)
    const latestEquity = parseFloat(latestData.equity);
    const latestFixedIncome = parseFloat(latestData.fixedIncome);
    const latestMutualFunds = parseFloat(latestData.mutualFunds);
    const latestOthers = parseFloat(latestData.others);
    
    const totalLatest = latestEquity + latestFixedIncome + latestMutualFunds + latestOthers;
    
    // Calculate total AUC for previous month
    const previousEquity = parseFloat(previousData.equity);
    const previousFixedIncome = parseFloat(previousData.fixedIncome);
    const previousMutualFunds = parseFloat(previousData.mutualFunds);
    const previousOthers = parseFloat(previousData.others);
    
    const totalPrevious = previousEquity + previousFixedIncome + previousMutualFunds + previousOthers;
    
    // Calculate growth rate
    const growthRate = ((totalLatest - totalPrevious) / totalPrevious) * 100;
    
    // Insert the calculated metrics into the database
    const metricsToInsert = {
      totalAuc: totalLatest.toFixed(1),
      equity: latestEquity.toFixed(1),
      fixedIncome: latestFixedIncome.toFixed(1),
      mutualFunds: latestMutualFunds.toFixed(1),
      others: latestOthers.toFixed(1),
      growth: growthRate.toFixed(1)
    };
    
    const [insertedMetrics] = await db.insert(aucMetrics).values(metricsToInsert).returning();
    return insertedMetrics;
  }

  async getIncome(): Promise<Income | undefined> {
    // Get the income history data first
    const incomeHistoryData = await this.getIncomeHistory();
    
    // If no history data, return existing or undefined
    if (incomeHistoryData.length < 2) {
      const existingIncome = await db.select().from(income);
      return existingIncome.length > 0 ? existingIncome[0] : undefined;
    }
    
    // Sort by date, most recent first
    const sortedData = incomeHistoryData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the most recent and previous month data
    const latestData = sortedData[0];
    const previousData = sortedData[1];
    
    // Calculate income values
    const latestAmount = parseFloat(latestData.amount);
    const previousAmount = parseFloat(previousData.amount);
    
    // Calculate the MTD income and outstanding fees (for simplicity, using 30% of income as outstanding)
    const incomeMTD = latestAmount;
    const outstandingFees = incomeMTD * 0.3;
    
    // Calculate growth rate and round to 2 decimal places
    const growthRate = ((latestAmount - previousAmount) / previousAmount) * 100;
    const formattedGrowthRate = growthRate.toFixed(2);
    
    // Update or insert the income data
    const existingIncome = await db.select().from(income);
    
    if (existingIncome.length > 0) {
      // Update existing record
      await db.update(income)
        .set({
          incomeMTD: incomeMTD.toFixed(2),
          outstandingFees: outstandingFees.toFixed(2),
          growth: formattedGrowthRate
        })
        .where(eq(income.id, existingIncome[0].id));
      
      // Get the updated record
      const [updatedIncome] = await db.select().from(income).where(eq(income.id, existingIncome[0].id));
      return updatedIncome;
    } else {
      // Insert new record
      const [insertedIncome] = await db.insert(income)
        .values({
          incomeMTD: incomeMTD.toFixed(2),
          outstandingFees: outstandingFees.toFixed(2),
          growth: formattedGrowthRate
        })
        .returning();
      return insertedIncome;
    }
  }

  async getIncomeByService(): Promise<IncomeByService[]> {
    const result = await db.select().from(incomeByService);
    return result;
  }

  async getIncomeHistory(): Promise<IncomeHistory[]> {
    const result = await db.select().from(incomeHistory);
    return result;
  }

  async getTopCustomers(): Promise<TopCustomers[]> {
    const result = await db.select().from(topCustomers);
    return result;
  }
  
  // Monthly customer data methods
  async getMonthlyCustomerData(): Promise<MonthlyCustomerData[]> {
    const result = await db.select().from(monthlyCustomerData);
    return result;
  }
  
  async createMonthlyCustomerData(data: InsertMonthlyCustomerData): Promise<MonthlyCustomerData> {
    const result = await db.insert(monthlyCustomerData).values(data).returning();
    return result[0];
  }
  
  // Customer history methods
  async getCustomerHistory(): Promise<CustomerHistory[]> {
    const result = await db.select().from(customerHistory);
    return result;
  }
  
  async createCustomerHistory(data: InsertCustomerHistory): Promise<CustomerHistory> {
    const result = await db.insert(customerHistory).values(data).returning();
    return result[0];
  }
  
  // Derived customer metrics methods
  async calculateDerivedCustomerMetrics(dataPoints: MonthlyCustomerData[]): Promise<CustomerMetrics> {
    if (dataPoints.length === 0) {
      throw new Error("No monthly customer data available");
    }
    
    // Get the latest month data
    const latestData = dataPoints.sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime()
    )[0];
    
    // Calculate total customers as sum of all segments
    const totalCustomers = latestData.institutional + latestData.corporate + 
      latestData.hni + latestData.funds;
    
    // Calculate new customers by comparing with previous month
    let newCustomersMTD = 0;
    if (dataPoints.length > 1) {
      const previousData = dataPoints.sort((a, b) => 
        new Date(b.month).getTime() - new Date(a.month).getTime()
      )[1];
      
      const previousTotal = previousData.institutional + previousData.corporate + 
        previousData.hni + previousData.funds;
        
      newCustomersMTD = Math.max(0, totalCustomers - previousTotal);
    }
    
    // Active customers is already part of the monthly data
    const activeCustomers = latestData.activeCustomers;
    
    return {
      id: 1, // This will be overwritten for database persistence
      totalCustomers,
      activeCustomers,
      newCustomersMTD,
      date: new Date()
    };
  }
  
  async calculateCustomerGrowth(dataPoints: MonthlyCustomerData[]): Promise<CustomerGrowth[]> {
    if (dataPoints.length === 0) {
      return [];
    }
    
    // Sort by date, oldest first
    const sortedData = dataPoints.sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
    
    const result: { id: number, date: Date, totalCustomers: number, newCustomers: number }[] = [];
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const totalCustomers = current.institutional + current.corporate + 
        current.hni + current.funds;
        
      let newCustomers = 0;
      if (i > 0) {
        const previous = sortedData[i-1];
        const previousTotal = previous.institutional + previous.corporate + 
          previous.hni + previous.funds;
          
        newCustomers = Math.max(0, totalCustomers - previousTotal);
      } else {
        // For the first month, use 5% of total as new customers
        newCustomers = Math.round(totalCustomers * 0.05);
      }
      
      result.push({
        id: i + 1, // Add sequential ID starting from 1
        date: new Date(current.month),
        totalCustomers,
        newCustomers
      });
    }
    
    return result;
  }
  
  async calculateCustomerSegments(dataPoint: MonthlyCustomerData): Promise<CustomerSegments[]> {
    // Calculate total
    const total = dataPoint.institutional + dataPoint.corporate + 
      dataPoint.hni + dataPoint.funds;
      
    if (total === 0) {
      throw new Error("Total customers cannot be zero");
    }
    
    // Calculate percentages
    return [
      {
        id: 1, // This will be overwritten for database persistence
        segmentName: "Institutional",
        percentage: ((dataPoint.institutional / total) * 100).toFixed(1)
      },
      {
        id: 2,
        segmentName: "Corporate",
        percentage: ((dataPoint.corporate / total) * 100).toFixed(1)
      },
      {
        id: 3,
        segmentName: "High Net Worth",
        percentage: ((dataPoint.hni / total) * 100).toFixed(1)
      },
      {
        id: 4,
        segmentName: "Funds",
        percentage: ((dataPoint.funds / total) * 100).toFixed(1)
      }
    ];
  }

  // Helper methods to generate consistent mock data
  private generateMockCustomerGrowth() {
    // Past 30 months data with data integrity
    const now = new Date();
    const data: { id: number, date: Date, totalCustomers: number, newCustomers: number }[] = [];
    
    // Base values for first month (Oct 2022)
    let totalCustomers = 8000; // Starting total
    
    // Generate data for each month ensuring data integrity
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Calculate new customers with realistic variability
      let newCustomers = 0;
      
      // Use patterns that make sense for the business
      if (i === 29) {
        // First month - define a reasonable starting point for new customers
        newCustomers = 400;
      } else {
        // Generate reasonable new customer numbers
        const baseNewCustomers = 80 + Math.sin(i / 2) * 60; // Basic oscillating pattern
        const seasonalNewCustomers = (i % 3 === 0) ? 350 : 0; // Quarterly spikes
        const randomNewCustomers = Math.floor(Math.random() * 100); // Random variations
        
        // Add market events (e.g., financial crises, booms)
        const marketEvent = (i === 15) ? 500 : (i === 8) ? 300 : 0; // Specific events
        
        // Growth trend - more new customers in later periods
        const growthTrend = Math.floor((29 - i) / 6) * 50;
        
        // Combine factors for new customers (always positive)
        newCustomers = Math.max(30, Math.floor(baseNewCustomers + seasonalNewCustomers + randomNewCustomers + marketEvent + growthTrend));
      }
      
      data.push({
        id: 30 - i, // Give each item a unique ID starting from 1
        date: date,
        totalCustomers: totalCustomers,
        newCustomers: newCustomers
      });
      
      // Update total customers for next iteration - ENSURING DATA INTEGRITY
      // Next month's total is this month's total plus new customers
      if (i > 0) { // For all but the last month
        totalCustomers = totalCustomers + newCustomers;
      }
    }
    
    return data;
  }

  private generateMockTradingVolume() {
    // Past 30 months data with more variability and market trends
    const now = new Date();
    const data = [];
    
    // Base trading volume
    let baseVolume = 15; // Start lower to show growth trend
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Add multiple factors to create realistic variability
      
      // Trend component - general market growth
      const trendFactor = (29-i) * 0.15;
      
      // Seasonal component - higher volumes in certain months (e.g., Q4, end of fiscal year)
      const seasonalFactor = Math.sin(i * Math.PI/6) * 3.5;
      
      // Market volatility component - random fluctuations
      const volatilityBase = Math.random() * 4 - 2; // Random between -2 and 2
      
      // Market cycles - longer term patterns in trading activity
      const marketCycle = Math.sin(i * Math.PI/12) * 5; // Yearly cycle
      
      // Major market events - significant spikes or drops at specific times
      let marketEvent = 0;
      if (i === 18) marketEvent = -8; // Market crash
      else if (i === 12) marketEvent = 10; // Bull market
      else if (i === 5) marketEvent = 5; // Recovery
      else if (i % 4 === 0) marketEvent = (Math.random() * 8 - 4); // Quarterly events
      
      // Calculate final volume with all factors
      const volume = baseVolume + trendFactor + seasonalFactor + volatilityBase + marketCycle + marketEvent;
      
      // Update base volume for next iteration to create dependencies between months
      // Volume growth has momentum (market trends tend to continue)
      const momentumFactor = (volume > baseVolume) ? 0.3 : -0.1; // Growth has more momentum than decline
      baseVolume = volume + momentumFactor;
      
      data.push({
        date: date,
        volume: parseFloat(volume.toFixed(1))
      });
    }
    
    return data;
  }

  private generateMockAucHistory() {
    // Past 30 months data with more variability in each asset class
    const now = new Date();
    const data = [];
    
    // Starting values for each asset class (lower values to show growth over time)
    let equity = 30;
    let fixedIncome = 26;
    let mutualFunds = 12;
    let others = 6;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Market conditions affect each asset class differently
      
      // Equity - more volatile, affected by market sentiment
      const equityMarketTrend = i * 0.4; // Overall growth trend
      const equitySeasonal = Math.sin(i * Math.PI/3) * 2.2; // Cyclical pattern
      const equityVolatility = (Math.random() * 3) - 1.5; // High volatility
      // Market events affect equities more dramatically
      const equityEvent = (i === 3 || i === 7) ? -2.8 : (i === 5 || i === 9) ? 2.5 : 0;
      
      // Fixed Income - more stable, less affected by market sentiment
      const fiMarketTrend = i * 0.25; // Slower growth
      const fiSeasonal = Math.sin(i * Math.PI/6) * 0.8; // Smaller cycles
      const fiVolatility = (Math.random() * 1.2) - 0.6; // Lower volatility
      // Interest rate changes affect fixed income
      const fiEvent = (i === 4 || i === 8) ? -1.2 : (i === 2) ? 0.8 : 0;
      
      // Mutual Funds - moderate volatility
      const mfMarketTrend = i * 0.2;
      const mfSeasonal = Math.cos(i * Math.PI/4) * 1.3;
      const mfVolatility = (Math.random() * 1.8) - 0.9;
      
      // Others - diverse asset types
      const othersMarketTrend = i * 0.1;
      const othersSeasonal = Math.sin(i * Math.PI/2) * 0.6;
      const othersVolatility = (Math.random() * 1.4) - 0.7;
      // Alternative investments sometimes see sudden interest
      const othersEvent = (i === 6) ? 2.0 : 0;
      
      // Calculate new values with momentum factors (markets tend to continue trends)
      equity = equity + equityMarketTrend + equitySeasonal + equityVolatility + equityEvent;
      // Momentum factor - continue trends
      equity = equity + (equity > 42 ? 0.3 : -0.2);
      
      fixedIncome = fixedIncome + fiMarketTrend + fiSeasonal + fiVolatility + fiEvent;
      fixedIncome = fixedIncome + (fixedIncome > 35 ? 0.2 : -0.1);
      
      mutualFunds = mutualFunds + mfMarketTrend + mfSeasonal + mfVolatility;
      mutualFunds = mutualFunds + (mutualFunds > 18 ? 0.15 : -0.1);
      
      others = others + othersMarketTrend + othersSeasonal + othersVolatility + othersEvent;
      others = others + (others > 9 ? 0.1 : -0.05);
      
      // Ensure all values stay positive
      equity = Math.max(equity, 35);
      fixedIncome = Math.max(fixedIncome, 30);
      mutualFunds = Math.max(mutualFunds, 15);
      others = Math.max(others, 7);
      
      data.push({
        date: date,
        equity: parseFloat(equity.toFixed(1)),
        fixedIncome: parseFloat(fixedIncome.toFixed(1)),
        mutualFunds: parseFloat(mutualFunds.toFixed(1)),
        others: parseFloat(others.toFixed(1))
      });
    }
    
    return data;
  }

  private generateMockIncomeHistory() {
    // Past 30 months data with more variability
    const now = new Date();
    const data = [];
    
    // Base income value (start lower to show growth)
    let baseIncome = 1.6;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      // Income is affected by several factors
      
      // General growth trend
      const growthTrend = i * 0.08;
      
      // Seasonal patterns - higher income in certain periods
      const seasonalPattern = Math.sin(i * Math.PI/3) * 0.4;
      
      // Business cycle effects - longer term oscillations
      const businessCycle = Math.sin(i * Math.PI/6) * 0.2;
      
      // Random fluctuations - monthly variations in business
      const randomFluctuation = (Math.random() * 0.4) - 0.2;
      
      // Market events - occasional significant impacts
      const marketEvent = (i === 3) ? -0.5 : (i === 7) ? 0.6 : 0;
      
      // Combined effect
      const incomeVariation = growthTrend + seasonalPattern + businessCycle + randomFluctuation + marketEvent;
      
      // Apply variations to base income
      const amount = baseIncome + incomeVariation;
      
      // Update base income with some momentum effect (income tends to build on itself)
      const momentum = (amount > baseIncome) ? 0.05 : -0.02;
      baseIncome = amount + momentum;
      
      // Ensure income stays reasonable and positive
      baseIncome = Math.max(baseIncome, 1.8);
      
      data.push({
        date: date,
        amount: parseFloat(amount.toFixed(2))
      });
    }
    
    return data;
  }

  // Method to seed the database with initial data
  async seedDatabase() {
    try {
      console.log("Checking database status...");
      
      // Check each table and seed only if empty
      // This way we don't lose data if one table fails to seed
      
      // Customer Metrics
      const existingMetrics = await db.select().from(customerMetrics);
      if (existingMetrics.length === 0) {
        console.log("Seeding customer metrics...");
        await db.insert(customerMetrics).values({
          totalCustomers: 12450,
          activeCustomers: 10230,
          newCustomersMTD: 175,
          date: new Date()
        });
      }
      
      // Customer Growth
      const existingGrowth = await db.select().from(customerGrowth);
      if (existingGrowth.length === 0) {
        console.log("Seeding customer growth...");
        for (const growth of this.generateMockCustomerGrowth()) {
          await db.insert(customerGrowth).values({
            date: growth.date,
            totalCustomers: growth.totalCustomers,
            newCustomers: growth.newCustomers
          });
        }
      }
      
      // Customer Segments
      const existingSegments = await db.select().from(customerSegments);
      if (existingSegments.length === 0) {
        console.log("Seeding customer segments...");
        const segments = [
          { segmentName: "Institutional", percentage: "45" },
          { segmentName: "Pension Funds", percentage: "25" },
          { segmentName: "High Net Worth", percentage: "20" },
          { segmentName: "Retail", percentage: "10" }
        ];
        
        for (const segment of segments) {
          await db.insert(customerSegments).values(segment);
        }
      }
      
      // Trading Volume
      const existingVolume = await db.select().from(tradingVolume);
      if (existingVolume.length === 0) {
        console.log("Seeding trading volume...");
        for (const volume of this.generateMockTradingVolume()) {
          await db.insert(tradingVolume).values({
            date: volume.date,
            volume: volume.volume.toString()
          });
        }
      }
      
      // AUC History
      const existingAucHistory = await db.select().from(aucHistory);
      if (existingAucHistory.length === 0) {
        console.log("Seeding AUC history...");
        for (const history of this.generateMockAucHistory()) {
          await db.insert(aucHistory).values({
            date: history.date,
            equity: history.equity.toString(),
            fixedIncome: history.fixedIncome.toString(),
            mutualFunds: history.mutualFunds.toString(),
            others: history.others.toString()
          });
        }
      }
      
      // AUC Metrics - calculate from the latest AUC history data
      const existingAucMetrics = await db.select().from(aucMetrics);
      if (existingAucMetrics.length === 0) {
        console.log("Seeding AUC metrics...");
        
        // Get the latest AUC history data to derive the metrics
        const aucHistoryData = await db.select().from(aucHistory).limit(20);
        
        // Sort by date (most recent first) in JavaScript
        aucHistoryData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        if (aucHistoryData.length > 0) {
          const latest = aucHistoryData[0];
          
          // Convert string values to numbers for calculations
          const equityValue = parseFloat(latest.equity);
          const fixedIncomeValue = parseFloat(latest.fixedIncome);
          const mutualFundsValue = parseFloat(latest.mutualFunds);
          const othersValue = parseFloat(latest.others);
          
          // Calculate total AUC
          const totalAucValue = equityValue + fixedIncomeValue + mutualFundsValue + othersValue;
          
          // Calculate growth if we have previous data
          let growthValue = 0;
          if (aucHistoryData.length > 1) {
            const previous = aucHistoryData[1];
            const previousTotal = parseFloat(previous.equity) + 
                                 parseFloat(previous.fixedIncome) + 
                                 parseFloat(previous.mutualFunds) + 
                                 parseFloat(previous.others);
            
            growthValue = ((totalAucValue - previousTotal) / previousTotal) * 100;
          }
          
          // Insert the calculated metrics
          await db.insert(aucMetrics).values({
            totalAuc: totalAucValue.toFixed(1),
            equity: equityValue.toFixed(1),
            fixedIncome: fixedIncomeValue.toFixed(1),
            mutualFunds: mutualFundsValue.toFixed(1),
            others: othersValue.toFixed(1),
            growth: growthValue.toFixed(1)
          });
        } else {
          // Fallback if no history data is available
          await db.insert(aucMetrics).values({
            totalAuc: "104.5",
            equity: "48.2",
            fixedIncome: "38.1",
            mutualFunds: "10.2",
            others: "8.0",
            growth: "-0.9"
          });
        }
      }
      
      // Income - calculate from income history data
      const existingIncome = await db.select().from(income);
      if (existingIncome.length === 0) {
        console.log("Seeding income...");
        
        // Get the latest income history data to derive the metrics
        const incomeHistoryData = await db.select().from(incomeHistory).limit(20);
        
        // Sort by date (most recent first) in JavaScript
        incomeHistoryData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        if (incomeHistoryData.length > 0) {
          const latest = incomeHistoryData[0];
          
          // Convert string value to number for calculation
          const incomeMTDValue = parseFloat(latest.amount);
          
          // Set outstanding fees as roughly 30% of monthly income
          const outstandingFeesValue = incomeMTDValue * 0.3;
          
          // Calculate growth if we have previous data
          let growthValue = 0;
          if (incomeHistoryData.length > 1) {
            const previous = incomeHistoryData[1];
            const previousAmount = parseFloat(previous.amount);
            
            growthValue = ((incomeMTDValue - previousAmount) / previousAmount) * 100;
          }
          
          // Insert the calculated metrics
          await db.insert(income).values({
            incomeMTD: incomeMTDValue.toFixed(2),
            outstandingFees: outstandingFeesValue.toFixed(2),
            growth: growthValue.toFixed(1)
          });
        } else {
          // Fallback if no history data is available
          await db.insert(income).values({
            incomeMTD: "2.75",
            outstandingFees: "0.85",
            growth: "3.2"
          });
        }
      }
      
      // Income By Service
      const existingIncomeByService = await db.select().from(incomeByService);
      if (existingIncomeByService.length === 0) {
        console.log("Seeding income by service...");
        const services = [
          { serviceName: "Custody Fees", amount: "12.4" },
          { serviceName: "Transaction Fees", amount: "8.6" },
          { serviceName: "Value Added Services", amount: "5.2" },
          { serviceName: "Reporting & Analytics", amount: "3.1" }
        ];
        
        for (const service of services) {
          await db.insert(incomeByService).values(service);
        }
      }
      
      // Income History
      const existingIncomeHistory = await db.select().from(incomeHistory);
      if (existingIncomeHistory.length === 0) {
        console.log("Seeding income history...");
        for (const history of this.generateMockIncomeHistory()) {
          await db.insert(incomeHistory).values({
            date: history.date,
            amount: history.amount.toString()
          });
        }
      }
      
      // Top Customers
      const existingTopCustomers = await db.select().from(topCustomers);
      if (existingTopCustomers.length === 0) {
        console.log("Seeding top customers...");
        const customers = [
          {
            name: "GlobalTech Pension",
            customerType: "Pension Fund",
            revenue: "2.48",
            assets: "12.5",
            changePercent: "8.2"
          },
          {
            name: "Eastbrook Investments",
            customerType: "Asset Manager",
            revenue: "1.95",
            assets: "10.3",
            changePercent: "6.4"
          },
          {
            name: "Atlantic Insurance Ltd",
            customerType: "Insurance",
            revenue: "1.62",
            assets: "8.7",
            changePercent: "5.3"
          },
          {
            name: "Summit Wealth Partners",
            customerType: "HNW Family Office",
            revenue: "1.24",
            assets: "6.8",
            changePercent: "4.9"
          },
          {
            name: "Pacific Financial Group",
            customerType: "Institutional",
            revenue: "1.05",
            assets: "5.9",
            changePercent: "3.7"
          }
        ];
        
        for (const customer of customers) {
          await db.insert(topCustomers).values(customer);
        }
      }
      
      // Monthly Customer Data
      const existingMonthlyData = await db.select().from(monthlyCustomerData);
      if (existingMonthlyData.length === 0) {
        console.log("Seeding monthly customer data...");
        
        // Create 12 months of data with more variability in customer segments
        const now = new Date();
        
        // Initial distribution of customers across segments
        let institutional = 5200;
        let corporate = 2800; 
        let hni = 2300;
        let funds = 1100;
        
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          
          // Add seasonal and trend factors with more variability
          
          // Institutional clients - higher growth in Q4 and Q1 (financial year cycles)
          const institutionalSeasonality = (i % 12 < 3 || i % 12 >= 9) ? 120 : -40;
          const institutionalRandom = Math.floor(Math.random() * 160) - 80;
          const institutionalGrowth = 50 + institutionalSeasonality + institutionalRandom;
          
          // Corporate clients - moderate growth with quarterly patterns
          const corporateSeasonality = Math.sin(i * Math.PI/6) * 70;
          const corporateRandom = Math.floor(Math.random() * 120) - 60;
          const corporateGrowth = 35 + corporateSeasonality + corporateRandom;
          
          // HNI clients - affected by market conditions (add variability)
          const hniSeasonality = Math.cos(i * Math.PI/3) * 60;
          const hniRandom = Math.floor(Math.random() * 100) - 50;
          const hniGrowth = 30 + hniSeasonality + hniRandom;
          
          // Fund clients - relatively stable with occasional spikes
          const fundsSeasonality = (i % 6 === 0) ? 80 : 10;
          const fundsRandom = Math.floor(Math.random() * 50) - 25;
          const fundsGrowth = 20 + fundsSeasonality + fundsRandom;
          
          // Update the running totals
          institutional = Math.max(institutional + institutionalGrowth, institutional * 0.98); // Never decrease by more than 2%
          corporate = Math.max(corporate + corporateGrowth, corporate * 0.97); // Allow slightly more decrease
          hni = Math.max(hni + hniGrowth, hni * 0.95); // HNI can be more volatile
          funds = Math.max(funds + fundsGrowth, funds * 0.98); // Funds relatively stable
          
          // Round to integers
          const institutionalValue = Math.round(institutional);
          const corporateValue = Math.round(corporate);
          const hniValue = Math.round(hni);
          const fundsValue = Math.round(funds);
          
          // Ensure active customers is less than total, with variable activity rate
          const total = institutionalValue + corporateValue + hniValue + fundsValue;
          
          // Activity rate varies by month (higher in busy periods)
          const activityBase = 0.80; // Base activity rate
          const activitySeasonal = (i % 3 === 0) ? 0.05 : 0; // Higher at quarter end
          const activityRandom = (Math.random() * 0.04) - 0.02; // +/- 2% random variation
          const activityRate = Math.min(Math.max(activityBase + activitySeasonal + activityRandom, 0.75), 0.92);
          
          const active = Math.floor(total * activityRate);
          
          await db.insert(monthlyCustomerData).values({
            month,
            institutional: institutionalValue,
            corporate: corporateValue,
            hni: hniValue,
            funds: fundsValue,
            activeCustomers: active
          });
        }
        
        // Customer History Data
        const existingCustomerHistory = await db.select().from(customerHistory);
        if (existingCustomerHistory.length === 0) {
          console.log("Seeding customer history data...");
          
          // Generate sample customer history records with the new schema
          const historyData = [
            {
              date: new Date(now.getFullYear(), now.getMonth() - 6, 1),
              totalCustomers: 11800,
              newCustomers: 120,
              churnedCustomers: 50,
              retentionRate: "95.5",
              acquisitionCost: "250.00",
              lifetimeValue: "2500.00",
              institutional: 5300,
              corporate: 3200,
              hni: 2100,
              funds: 1200,
              total: 11800,
              new: 120,
              active: 10200
            },
            {
              date: new Date(now.getFullYear(), now.getMonth() - 3, 1),
              totalCustomers: 12000,
              newCustomers: 150,
              churnedCustomers: 45,
              retentionRate: "96.2",
              acquisitionCost: "245.00",
              lifetimeValue: "2550.00",
              institutional: 5400,
              corporate: 3300,
              hni: 2150,
              funds: 1150,
              total: 12000,
              new: 150,
              active: 10400
            },
            {
              date: new Date(now.getFullYear(), now.getMonth(), 1),
              totalCustomers: 12300,
              newCustomers: 170,
              churnedCustomers: 40,
              retentionRate: "96.8",
              acquisitionCost: "240.00",
              lifetimeValue: "2600.00",
              institutional: 5550,
              corporate: 3400,
              hni: 2200,
              funds: 1150,
              total: 12300,
              new: 170,
              active: 10700
            }
          ];
          
          for (const record of historyData) {
            await db.insert(customerHistory).values(record);
          }
        }
        
        // After populating the monthly data, update dependent tables
        // using the calculation methods
        const allMonthlyData = await db.select().from(monthlyCustomerData);
        
        // Update customer segments based on the latest month
        const latestMonth = allMonthlyData.sort((a, b) => 
          new Date(b.month).getTime() - new Date(a.month).getTime()
        )[0];
        
        const segments = await this.calculateCustomerSegments(latestMonth);
        await db.delete(customerSegments);
        for (const segment of segments) {
          await db.insert(customerSegments).values({
            segmentName: segment.segmentName,
            percentage: segment.percentage
          });
        }
        
        // Update customer growth data
        const growthData = await this.calculateCustomerGrowth(allMonthlyData);
        await db.delete(customerGrowth);
        for (const growth of growthData) {
          await db.insert(customerGrowth).values({
            date: growth.date,
            totalCustomers: growth.totalCustomers,
            newCustomers: growth.newCustomers
          });
        }
        
        // Update the customer metrics with derived values
        const metrics = await this.calculateDerivedCustomerMetrics(allMonthlyData);
        await db.delete(customerMetrics);
        await db.insert(customerMetrics).values({
          totalCustomers: metrics.totalCustomers,
          activeCustomers: metrics.activeCustomers,
          newCustomersMTD: metrics.newCustomersMTD,
          date: metrics.date
        });
      }
      
      console.log("Database seeding completed");
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error; // Re-throw to allow the caller to handle it
    }
  }
}

// Use MemStorage as fallback if database connection fails
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customMetrics: CustomerMetrics | undefined;
  private customGrowth: CustomerGrowth[];
  private customSegments: CustomerSegments[];
  private tradingVol: TradingVolume[];
  private aucHist: AucHistory[];
  private aucMet: AucMetrics | undefined;
  private inc: Income | undefined;
  private incByService: IncomeByService[];
  private incHistory: IncomeHistory[];
  private topCust: TopCustomers[];
  private monthlyData: MonthlyCustomerData[];
  private custHistory: CustomerHistory[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.customMetrics = {
      id: 1,
      totalCustomers: 12450,
      activeCustomers: 10230,
      newCustomersMTD: 175,
      date: new Date()
    };
    // Initialize customer history with sample data
    const currentDate = new Date();
    this.custHistory = [
      {
        id: 1,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1),
        totalCustomers: 11800,
        newCustomers: 120,
        churnedCustomers: 50,
        retentionRate: "95.5",
        acquisitionCost: "250.00",
        lifetimeValue: "2500.00",
        institutional: 5300,
        corporate: 3200,
        hni: 2100,
        funds: 1200,
        total: 11800,
        new: 120,
        active: 10200
      },
      {
        id: 2,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1),
        totalCustomers: 12000,
        newCustomers: 150,
        churnedCustomers: 45,
        retentionRate: "96.2",
        acquisitionCost: "245.00",
        lifetimeValue: "2550.00",
        institutional: 5400,
        corporate: 3300,
        hni: 2150,
        funds: 1150,
        total: 12000,
        new: 150,
        active: 10400
      },
      {
        id: 3,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        totalCustomers: 12300,
        newCustomers: 170,
        churnedCustomers: 40,
        retentionRate: "96.8",
        acquisitionCost: "240.00",
        lifetimeValue: "2600.00",
        institutional: 5550,
        corporate: 3400,
        hni: 2200,
        funds: 1150,
        total: 12300,
        new: 170,
        active: 10700
      }
    ];
    
    // Initialize monthly data with 12 months of data
    this.monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      
      // Base values with small growth each month
      const baseInstitutional = 5500 + (i * 60);
      const baseCorporate = 3100 + (i * 35);
      const baseHNI = 2500 + (i * 25);
      const baseFunds = 1200 + (i * 10);
      
      // Ensure active customers is less than total
      const total = baseInstitutional + baseCorporate + baseHNI + baseFunds;
      const active = Math.floor(total * 0.82); // 82% active rate
      
      this.monthlyData.push({
        id: 12 - i,
        month,
        institutional: baseInstitutional,
        corporate: baseCorporate,
        hni: baseHNI,
        funds: baseFunds,
        activeCustomers: active
      });
    }
    
    this.customGrowth = [];
    this.customSegments = [
      { id: 1, segmentName: "Institutional", percentage: "45" },
      { id: 2, segmentName: "Corporate", percentage: "25" },
      { id: 3, segmentName: "High Net Worth", percentage: "20" },
      { id: 4, segmentName: "Funds", percentage: "10" }
    ];
    this.tradingVol = [];
    this.aucHist = [];
    this.aucMet = {
      id: 1,
      totalAuc: "104.5",
      equity: "48.2",
      fixedIncome: "38.1",
      mutualFunds: "10.2",
      others: "8.0",
      growth: "-0.9"
    };
    this.inc = {
      id: 1,
      incomeMTD: "2.75",
      outstandingFees: "0.85",
      growth: "3.2"
    };
    this.incByService = [
      { id: 1, serviceName: "Custody Fees", amount: "12.4" },
      { id: 2, serviceName: "Transaction Fees", amount: "8.6" },
      { id: 3, serviceName: "Value Added Services", amount: "5.2" },
      { id: 4, serviceName: "Reporting & Analytics", amount: "3.1" }
    ];
    this.incHistory = [];
    this.topCust = [
      {
        id: 1,
        name: "GlobalTech Pension",
        customerType: "Pension Fund",
        revenue: "2.48",
        assets: "12.5",
        changePercent: "8.2"
      },
      {
        id: 2,
        name: "Eastbrook Investments",
        customerType: "Asset Manager",
        revenue: "1.95",
        assets: "10.3",
        changePercent: "6.4"
      },
      {
        id: 3,
        name: "Atlantic Insurance Ltd",
        customerType: "Insurance",
        revenue: "1.62",
        assets: "8.7",
        changePercent: "5.3"
      },
      {
        id: 4,
        name: "Summit Wealth Partners",
        customerType: "HNW Family Office",
        revenue: "1.24",
        assets: "6.8",
        changePercent: "4.9"
      },
      {
        id: 5,
        name: "Pacific Financial Group",
        customerType: "Institutional",
        revenue: "1.05",
        assets: "5.9",
        changePercent: "3.7"
      }
    ];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCustomerMetrics(): Promise<CustomerMetrics | undefined> {
    return this.customMetrics;
  }

  async getCustomerGrowth(): Promise<CustomerGrowth[]> {
    return this.customGrowth;
  }

  async getCustomerSegments(): Promise<CustomerSegments[]> {
    return this.customSegments;
  }

  async getTradingVolume(): Promise<TradingVolume[]> {
    return this.tradingVol;
  }

  async getAucHistory(): Promise<AucHistory[]> {
    return this.aucHist;
  }

  async getAucMetrics(): Promise<AucMetrics | undefined> {
    return this.aucMet;
  }

  async getIncome(): Promise<Income | undefined> {
    return this.inc;
  }

  async getIncomeByService(): Promise<IncomeByService[]> {
    return this.incByService;
  }

  async getIncomeHistory(): Promise<IncomeHistory[]> {
    return this.incHistory;
  }

  async getTopCustomers(): Promise<TopCustomers[]> {
    return this.topCust;
  }

  async getMonthlyCustomerData(): Promise<MonthlyCustomerData[]> {
    return this.monthlyData;
  }
  
  async createMonthlyCustomerData(data: InsertMonthlyCustomerData): Promise<MonthlyCustomerData> {
    const id = this.monthlyData.length > 0 
      ? Math.max(...this.monthlyData.map(item => item.id)) + 1 
      : 1;
      
    const newData: MonthlyCustomerData = {
      ...data,
      id
    };
    
    this.monthlyData.push(newData);
    return newData;
  }
  
  async getCustomerHistory(): Promise<CustomerHistory[]> {
    return this.custHistory;
  }
  
  async createCustomerHistory(data: InsertCustomerHistory): Promise<CustomerHistory> {
    const id = this.custHistory.length > 0 
      ? Math.max(...this.custHistory.map(item => item.id)) + 1 
      : 1;
      
    const newData: CustomerHistory = {
      ...data,
      id
    };
    
    this.custHistory.push(newData);
    return newData;
  }
  
  async calculateDerivedCustomerMetrics(dataPoints: MonthlyCustomerData[]): Promise<CustomerMetrics> {
    if (dataPoints.length === 0) {
      throw new Error("No monthly customer data available");
    }
    
    // Get the latest month data
    const latestData = dataPoints.sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime()
    )[0];
    
    // Calculate total customers as sum of all segments
    const totalCustomers = latestData.institutional + latestData.corporate + 
      latestData.hni + latestData.funds;
    
    // Calculate new customers by comparing with previous month
    let newCustomersMTD = 0;
    if (dataPoints.length > 1) {
      const previousData = dataPoints.sort((a, b) => 
        new Date(b.month).getTime() - new Date(a.month).getTime()
      )[1];
      
      const previousTotal = previousData.institutional + previousData.corporate + 
        previousData.hni + previousData.funds;
        
      newCustomersMTD = Math.max(0, totalCustomers - previousTotal);
    }
    
    // Active customers is already part of the monthly data
    const activeCustomers = latestData.activeCustomers;
    
    return {
      id: 1, // This will be overwritten for database persistence
      totalCustomers,
      activeCustomers,
      newCustomersMTD,
      date: new Date()
    };
  }
  
  async calculateCustomerGrowth(dataPoints: MonthlyCustomerData[]): Promise<CustomerGrowth[]> {
    if (dataPoints.length === 0) {
      return [];
    }
    
    // Sort by date, oldest first
    const sortedData = dataPoints.sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
    
    const result: CustomerGrowth[] = [];
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const totalCustomers = current.institutional + current.corporate + 
        current.hni + current.funds;
        
      let newCustomers = 0;
      if (i > 0) {
        const previous = sortedData[i-1];
        const previousTotal = previous.institutional + previous.corporate + 
          previous.hni + previous.funds;
          
        newCustomers = Math.max(0, totalCustomers - previousTotal);
      } else {
        // For the first month, use 5% of total as new customers
        newCustomers = Math.round(totalCustomers * 0.05);
      }
      
      result.push({
        id: i + 1,
        date: new Date(current.month),
        totalCustomers,
        newCustomers
      });
    }
    
    return result;
  }
  
  async calculateCustomerSegments(dataPoint: MonthlyCustomerData): Promise<CustomerSegments[]> {
    // Calculate total
    const total = dataPoint.institutional + dataPoint.corporate + 
      dataPoint.hni + dataPoint.funds;
      
    if (total === 0) {
      throw new Error("Total customers cannot be zero");
    }
    
    // Calculate percentages
    return [
      {
        id: 1,
        segmentName: "Institutional",
        percentage: ((dataPoint.institutional / total) * 100).toFixed(1)
      },
      {
        id: 2,
        segmentName: "Corporate",
        percentage: ((dataPoint.corporate / total) * 100).toFixed(1)
      },
      {
        id: 3,
        segmentName: "High Net Worth",
        percentage: ((dataPoint.hni / total) * 100).toFixed(1)
      },
      {
        id: 4,
        segmentName: "Funds",
        percentage: ((dataPoint.funds / total) * 100).toFixed(1)
      }
    ];
  }
  
  async seedDatabase(): Promise<void> {
    console.log("Using memory storage, no seeding needed");
  }
}

// Database Storage implementation following the blueprint
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // All other methods are already implemented in PostgresStorage
  // We're keeping the PostgresStorage implementation for now and will gradually migrate to this cleaner approach
}

// First try to use PostgresStorage, fallback to MemStorage if there's an issue
let storage: IStorage;
try {
  // Test database connection
  storage = new PostgresStorage();
  console.log("Using PostgreSQL storage");
  
  // Seed the database
  storage.seedDatabase().catch(err => {
    console.error("Error seeding database:", err);
  });
} catch (error) {
  console.error("Failed to initialize PostgreSQL storage, falling back to memory storage", error);
  storage = new MemStorage();
}

export { storage };
