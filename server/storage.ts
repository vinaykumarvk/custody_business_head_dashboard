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
  topCustomers, type TopCustomers, type InsertTopCustomers
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
    const result = await db.select().from(customerMetrics);
    return result[0];
  }

  async getCustomerGrowth(): Promise<CustomerGrowth[]> {
    const result = await db.select().from(customerGrowth);
    return result;
  }

  async getCustomerSegments(): Promise<CustomerSegments[]> {
    const result = await db.select().from(customerSegments);
    return result;
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
    const result = await db.select().from(aucMetrics);
    return result[0];
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

  // Helper methods to generate consistent mock data
  private generateMockCustomerGrowth() {
    // Past 12 months data
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const baseTotal = 11000 + (11 - i) * 130;
      const newCustomers = 100 + Math.floor((i % 3 + 1) * 50);
      
      data.push({
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
          others: "8.0"
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
    this.customGrowth = [];
    this.customSegments = [
      { id: 1, segmentName: "Institutional", percentage: "45" },
      { id: 2, segmentName: "Pension Funds", percentage: "25" },
      { id: 3, segmentName: "High Net Worth", percentage: "20" },
      { id: 4, segmentName: "Retail", percentage: "10" }
    ];
    this.tradingVol = [];
    this.aucHist = [];
    this.aucMet = {
      id: 1,
      totalAuc: "104.5",
      equity: "48.2",
      fixedIncome: "38.1",
      mutualFunds: "10.2",
      others: "8.0"
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
