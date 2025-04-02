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
    // Get customer growth data instead of history
    const growthData = await this.getCustomerGrowth();
    
    // If no growth data, return from customerMetrics table (fallback)
    if (growthData.length === 0) {
      const result = await db.select().from(customerMetrics);
      return result[0];
    }
    
    // Get the most recent growth record
    const latestData = growthData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    // Calculate active customers (approximately 85-90% of total)
    const activeCustomers = Math.floor(latestData.totalCustomers * 0.88);
    
    // Return metrics based on latest growth data
    return {
      id: 1,
      totalCustomers: latestData.totalCustomers,
      activeCustomers: activeCustomers,
      newCustomersMTD: latestData.newCustomers,
      date: new Date()
    };
  }

  async getCustomerGrowth(): Promise<CustomerGrowth[]> {
    // Get data directly from customerGrowth table and order by date in the database query
    const result = await db.select()
      .from(customerGrowth)
      .orderBy(customerGrowth.date);
    
    console.log("Retrieved customer growth data:", result.map(r => 
      `${new Date(r.date).toISOString().substr(0,10)}: Total=${r.totalCustomers}, New=${r.newCustomers}`
    ).join('\n'));
    
    return result;
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