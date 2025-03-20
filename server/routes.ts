import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  
  // Customer Metrics endpoint
  app.get("/api/customer-metrics", async (_req, res) => {
    try {
      const metrics = {
        totalCustomers: 12450,
        activeCustomers: 10230,
        newCustomersMTD: 175,
        date: new Date().toISOString()
      };
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer metrics" });
    }
  });

  // Customer Growth endpoint
  app.get("/api/customer-growth", async (_req, res) => {
    try {
      // Past 12 months data
      const now = new Date();
      const data = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const baseTotal = 11000 + (11 - i) * 130;
        const newCustomers = 100 + Math.floor(Math.random() * 150);
        
        data.push({
          date: date.toISOString(),
          totalCustomers: baseTotal,
          newCustomers: newCustomers
        });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer growth data" });
    }
  });

  // Customer Segments endpoint
  app.get("/api/customer-segments", async (_req, res) => {
    try {
      const segments = [
        { id: 1, segmentName: "Institutional", percentage: 45 },
        { id: 2, segmentName: "Pension Funds", percentage: 25 },
        { id: 3, segmentName: "High Net Worth", percentage: 20 },
        { id: 4, segmentName: "Retail", percentage: 10 }
      ];
      
      res.json(segments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer segments" });
    }
  });

  // Trading Volume History endpoint
  app.get("/api/trading-volume", async (_req, res) => {
    try {
      // Past 12 months data
      const now = new Date();
      const data = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const volume = 22 + Math.floor(Math.random() * 8) + (i * 0.5);
        
        data.push({
          date: date.toISOString(),
          volume: volume
        });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading volume data" });
    }
  });

  // AUC (Assets Under Custody) History endpoint
  app.get("/api/auc-history", async (_req, res) => {
    try {
      // Past 12 months data
      const now = new Date();
      const data = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const baseEquity = 42 + (i * 0.4);
        const baseFixedIncome = 35 + (i * 0.25);
        const baseMutual = 18 + (i * 0.15);
        const baseOthers = 9 + (i * 0.05);
        
        data.push({
          date: date.toISOString(),
          equity: baseEquity,
          fixedIncome: baseFixedIncome,
          mutualFunds: baseMutual,
          others: baseOthers
        });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AUC history data" });
    }
  });

  // AUC Metrics endpoint
  app.get("/api/auc-metrics", async (_req, res) => {
    try {
      const metrics = {
        totalAuc: 104.5,
        equity: 48.2,
        fixedIncome: 38.1,
        mutualFunds: 10.2,
        others: 8.0
      };
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AUC metrics" });
    }
  });

  // Income metrics endpoint
  app.get("/api/income", async (_req, res) => {
    try {
      const incomeData = {
        incomeMTD: 2.75,
        outstandingFees: 0.85
      };
      
      res.json(incomeData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch income data" });
    }
  });

  // Income by Service endpoint
  app.get("/api/income-by-service", async (_req, res) => {
    try {
      const incomeByService = [
        { id: 1, serviceName: "Custody Fees", amount: 12.4 },
        { id: 2, serviceName: "Transaction Fees", amount: 8.6 },
        { id: 3, serviceName: "Value Added Services", amount: 5.2 },
        { id: 4, serviceName: "Reporting & Analytics", amount: 3.1 }
      ];
      
      res.json(incomeByService);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch income by service data" });
    }
  });

  // Income History endpoint
  app.get("/api/income-history", async (_req, res) => {
    try {
      // Past 12 months data
      const now = new Date();
      const data = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const amount = 2.2 + Math.random() * 0.8 + (i * 0.05);
        
        data.push({
          date: date.toISOString(),
          amount: parseFloat(amount.toFixed(2))
        });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch income history data" });
    }
  });

  // Top Revenue Customers endpoint
  app.get("/api/top-customers", async (_req, res) => {
    try {
      const topCustomers = [
        {
          id: 1,
          name: "GlobalTech Pension",
          customerType: "Pension Fund",
          revenue: 2.48,
          assets: 12.5,
          changePercent: 8.2
        },
        {
          id: 2,
          name: "Eastbrook Investments",
          customerType: "Asset Manager",
          revenue: 1.95,
          assets: 10.3,
          changePercent: 6.4
        },
        {
          id: 3,
          name: "Atlantic Insurance Ltd",
          customerType: "Insurance",
          revenue: 1.62,
          assets: 8.7,
          changePercent: 5.3
        },
        {
          id: 4,
          name: "Summit Wealth Partners",
          customerType: "HNW Family Office",
          revenue: 1.24,
          assets: 6.8,
          changePercent: 4.9
        },
        {
          id: 5,
          name: "Pacific Financial Group",
          customerType: "Institutional",
          revenue: 1.05,
          assets: 5.9,
          changePercent: 3.7
        }
      ];
      
      res.json(topCustomers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top customers" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
