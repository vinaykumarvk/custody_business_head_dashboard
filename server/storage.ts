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
import { eq } from 'drizzle-orm';
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
    // Get customer history data
    const history = await this.getCustomerHistory();
    
    // If no history data, return from customerGrowth table (fallback)
    if (history.length === 0) {
      const result = await db.select().from(customerGrowth);
      return result;
    }
    
    // Sort by date, oldest first
    const sortedData = history.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Map customer history to customer growth format
    return sortedData.map((item, index) => ({
      id: index + 1, 
      date: new Date(item.date),
      totalCustomers: item.totalCustomers,
      newCustomers: item.newCustomers
    }));
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
    const result = await db.select().from(income);
    return result[0];
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
    // Past 12 months data
    const now = new Date();
    const data: { id: number, date: Date, totalCustomers: number, newCustomers: number }[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const baseTotal = 11000 + (11 - i) * 130;
      const newCustomers = 100 + Math.floor((i % 3 + 1) * 50);
      
      data.push({
        id: 12 - i, // Give each item a unique ID starting from 1
        date: date,
        totalCustomers: baseTotal,
        newCustomers: newCustomers
      });
    }
    
    return data;
  }

  private generateMockTradingVolume() {
    // Past 12 months data with consistent growth pattern
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const volume = 22 + (i * 0.5) + (Math.sin(i) * 2);
      
      data.push({
        date: date,
        volume: parseFloat(volume.toFixed(1))
      });
    }
    
    return data;
  }

  private generateMockAucHistory() {
    // Past 12 months data with consistent growth patterns
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const baseEquity = 42 + (i * 0.4);
      const baseFixedIncome = 35 + (i * 0.25);
      const baseMutual = 18 + (i * 0.15);
      const baseOthers = 9 + (i * 0.05);
      
      data.push({
        date: date,
        equity: parseFloat(baseEquity.toFixed(1)),
        fixedIncome: parseFloat(baseFixedIncome.toFixed(1)),
        mutualFunds: parseFloat(baseMutual.toFixed(1)),
        others: parseFloat(baseOthers.toFixed(1))
      });
    }
    
    return data;
  }

  private generateMockIncomeHistory() {
    // Past 12 months data
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const amount = 2.2 + (i * 0.05) + (Math.sin(i / 2) * 0.3);
      
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
      
      // AUC Metrics
      const existingAucMetrics = await db.select().from(aucMetrics);
      if (existingAucMetrics.length === 0) {
        console.log("Seeding AUC metrics...");
        await db.insert(aucMetrics).values({
          totalAuc: "104.5",
          equity: "48.2",
          fixedIncome: "38.1",
          mutualFunds: "10.2",
          others: "8.0",
          growth: "-0.9"
        });
      }
      
      // Income
      const existingIncome = await db.select().from(income);
      if (existingIncome.length === 0) {
        console.log("Seeding income...");
        await db.insert(income).values({
          incomeMTD: "2.75",
          outstandingFees: "0.85"
        });
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
        
        // Create 12 months of data with consistent growth patterns
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          
          // Base values with small growth each month
          const baseInstitutional = 5500 + (i * 60);
          const baseCorporate = 3100 + (i * 35);
          const baseHNI = 2500 + (i * 25);
          const baseFunds = 1200 + (i * 10);
          
          // Ensure active customers is less than total
          const total = baseInstitutional + baseCorporate + baseHNI + baseFunds;
          const active = Math.floor(total * 0.82); // 82% active rate
          
          await db.insert(monthlyCustomerData).values({
            month,
            institutional: baseInstitutional,
            corporate: baseCorporate,
            hni: baseHNI,
            funds: baseFunds,
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
      outstandingFees: "0.85"
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
