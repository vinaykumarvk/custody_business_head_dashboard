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
import { eq, desc, asc } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from './db';

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

  async getCustomerMetrics(): Promise<CustomerMetrics | undefined> {
    const [metrics] = await db.select().from(customerMetrics);
    return metrics || undefined;
  }

  async getCustomerGrowth(): Promise<CustomerGrowth[]> {
    const result = await db.select().from(customerGrowth).orderBy(asc(customerGrowth.date));
    return result;
  }

  async getCustomerSegments(): Promise<CustomerSegments[]> {
    return db.select().from(customerSegments);
  }

  async getTradingVolume(): Promise<TradingVolume[]> {
    return db.select().from(tradingVolume).orderBy(asc(tradingVolume.date));
  }

  async getAucHistory(): Promise<AucHistory[]> {
    return db.select().from(aucHistory).orderBy(asc(aucHistory.date));
  }

  async getAucMetrics(): Promise<AucMetrics | undefined> {
    const [metrics] = await db.select().from(aucMetrics);
    return metrics || undefined;
  }

  async getIncome(): Promise<Income | undefined> {
    const [incomeData] = await db.select().from(income);
    return incomeData || undefined;
  }

  async getIncomeByService(): Promise<IncomeByService[]> {
    return db.select().from(incomeByService);
  }

  async getIncomeHistory(): Promise<IncomeHistory[]> {
    return db.select().from(incomeHistory).orderBy(asc(incomeHistory.date));
  }

  async getTopCustomers(): Promise<TopCustomers[]> {
    return db.select().from(topCustomers);
  }
  
  // Monthly customer data methods
  async getMonthlyCustomerData(): Promise<MonthlyCustomerData[]> {
    return db.select().from(monthlyCustomerData).orderBy(asc(monthlyCustomerData.month));
  }
  
  async createMonthlyCustomerData(data: InsertMonthlyCustomerData): Promise<MonthlyCustomerData> {
    const [result] = await db.insert(monthlyCustomerData).values(data).returning();
    return result;
  }
  
  // Customer history methods
  async getCustomerHistory(): Promise<CustomerHistory[]> {
    return db.select().from(customerHistory).orderBy(asc(customerHistory.date));
  }
  
  async createCustomerHistory(data: InsertCustomerHistory): Promise<CustomerHistory> {
    const [result] = await db.insert(customerHistory).values(data).returning();
    return result;
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

  async seedDatabase(): Promise<void> {
    // No need to implement seeding if we're using the existing database
    console.log("Using database storage, seeding not needed");
  }
}

// Use DatabaseStorage with the imported db
export const storage = new DatabaseStorage();
