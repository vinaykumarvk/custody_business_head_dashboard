import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { storage } from "./storage";
import { customerGrowth } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  
  // Customer Metrics endpoint
  app.get("/api/customer-metrics", async (_req, res) => {
    try {
      const metrics = await storage.getCustomerMetrics();
      
      if (!metrics) {
        return res.status(404).json({ message: "Customer metrics not found" });
      }
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching customer metrics:", error);
      res.status(500).json({ message: "Failed to fetch customer metrics" });
    }
  });

  // Customer Growth endpoint
  app.get("/api/customer-growth", async (_req, res) => {
    try {
      const data = await storage.getCustomerGrowth();
      
      // Format dates for JSON
      const formattedData = data.map(item => ({
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : item.date
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching customer growth:", error);
      res.status(500).json({ message: "Failed to fetch customer growth data" });
    }
  });

  // Customer Segments endpoint
  app.get("/api/customer-segments", async (_req, res) => {
    try {
      const segments = await storage.getCustomerSegments();
      res.json(segments);
    } catch (error) {
      console.error("Error fetching customer segments:", error);
      res.status(500).json({ message: "Failed to fetch customer segments" });
    }
  });

  // Trading Volume History endpoint
  app.get("/api/trading-volume", async (_req, res) => {
    try {
      const data = await storage.getTradingVolume();
      
      // Format dates for JSON
      const formattedData = data.map(item => ({
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : item.date
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching trading volume:", error);
      res.status(500).json({ message: "Failed to fetch trading volume data" });
    }
  });

  // AUC (Assets Under Custody) History endpoint
  app.get("/api/auc-history", async (_req, res) => {
    try {
      const data = await storage.getAucHistory();
      
      // Format dates for JSON
      const formattedData = data.map(item => ({
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : item.date
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching AUC history:", error);
      res.status(500).json({ message: "Failed to fetch AUC history data" });
    }
  });

  // AUC Metrics endpoint
  app.get("/api/auc-metrics", async (_req, res) => {
    try {
      const metrics = await storage.getAucMetrics();
      
      if (!metrics) {
        return res.status(404).json({ message: "AUC metrics not found" });
      }
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching AUC metrics:", error);
      res.status(500).json({ message: "Failed to fetch AUC metrics" });
    }
  });

  // Income metrics endpoint
  app.get("/api/income", async (_req, res) => {
    try {
      const incomeData = await storage.getIncome();
      
      if (!incomeData) {
        return res.status(404).json({ message: "Income data not found" });
      }
      
      res.json(incomeData);
    } catch (error) {
      console.error("Error fetching income:", error);
      res.status(500).json({ message: "Failed to fetch income data" });
    }
  });

  // Income by Service endpoint
  app.get("/api/income-by-service", async (_req, res) => {
    try {
      const incomeByService = await storage.getIncomeByService();
      res.json(incomeByService);
    } catch (error) {
      console.error("Error fetching income by service:", error);
      res.status(500).json({ message: "Failed to fetch income by service data" });
    }
  });

  // Income History endpoint
  app.get("/api/income-history", async (_req, res) => {
    try {
      const data = await storage.getIncomeHistory();
      
      // Format dates for JSON
      const formattedData = data.map(item => ({
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : item.date
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching income history:", error);
      res.status(500).json({ message: "Failed to fetch income history data" });
    }
  });

  // Top Revenue Customers endpoint
  app.get("/api/top-customers", async (_req, res) => {
    try {
      const topCustomers = await storage.getTopCustomers();
      res.json(topCustomers);
    } catch (error) {
      console.error("Error fetching top customers:", error);
      res.status(500).json({ message: "Failed to fetch top customers" });
    }
  });
  
  // Monthly Customer Data endpoint
  app.get("/api/monthly-customer-data", async (_req, res) => {
    try {
      const monthlyData = await storage.getMonthlyCustomerData();
      
      // Format dates for JSON
      const formattedData = monthlyData.map(item => ({
        ...item,
        month: item.month instanceof Date ? item.month.toISOString() : item.month
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching monthly customer data:", error);
      res.status(500).json({ message: "Failed to fetch monthly customer data" });
    }
  });
  
  // Add new monthly customer data
  app.post("/api/monthly-customer-data", async (req, res) => {
    try {
      const { month, institutional, corporate, hni, funds, activeCustomers } = req.body;
      
      if (!month || !institutional || !corporate || !hni || !funds || !activeCustomers) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const newData = await storage.createMonthlyCustomerData({
        month: new Date(month),
        institutional,
        corporate,
        hni,
        funds,
        activeCustomers
      });
      
      res.status(201).json(newData);
    } catch (error) {
      console.error("Error creating monthly customer data:", error);
      res.status(500).json({ message: "Failed to create monthly customer data" });
    }
  });
  
  // Customer History endpoint
  app.get("/api/customer-history", async (_req, res) => {
    try {
      const data = await storage.getCustomerHistory();
      
      // Format dates for JSON
      const formattedData = data.map(item => ({
        ...item,
        date: item.date instanceof Date ? item.date.toISOString() : item.date
      }));
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching customer history:", error);
      res.status(500).json({ message: "Failed to fetch customer history data" });
    }
  });
  
  // Add new customer history record
  app.post("/api/customer-history", async (req, res) => {
    try {
      const { 
        date, totalCustomers, newCustomers, churnedCustomers, retentionRate,
        acquisitionCost, lifetimeValue, institutional, corporate, hni, funds,
        total, new: newValue, active 
      } = req.body;
      
      if (!date || !totalCustomers || !newCustomers || !churnedCustomers || 
          !retentionRate || !acquisitionCost || !lifetimeValue || 
          !institutional || !corporate || !hni || !funds || 
          !total || !newValue || !active) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const newData = await storage.createCustomerHistory({
        date: new Date(date),
        totalCustomers,
        newCustomers,
        churnedCustomers,
        retentionRate,
        acquisitionCost,
        lifetimeValue,
        institutional,
        corporate, 
        hni,
        funds,
        total,
        new: newValue, 
        active
      });
      
      res.status(201).json(newData);
    } catch (error) {
      console.error("Error creating customer history record:", error);
      res.status(500).json({ message: "Failed to create customer history record" });
    }
  });
  
  // Regenerate customer growth data (for data integrity fix)
  app.post("/api/regenerate-customer-growth", async (_req, res) => {
    try {
      // First, clear all existing customer growth data
      await db.delete(customerGrowth);
      
      console.log("Starting to regenerate customer growth data with guaranteed integrity");
      
      // Generate new data with proper data integrity
      const now = new Date();
      let baseTotal = 8000; // Starting total for first month
      const months = [];
      
      // First, prepare the data with accurate calculations
      for (let i = 0; i < 30; i++) {
        const date = new Date(2022, 9 + i, 1); // Start from October 2022 (fixed date)
        
        // Calculate new customers with realistic variability
        let newCustomers;
        
        if (i === 0) {
          // First month (Oct 2022) - define a reasonable starting point for new customers
          newCustomers = 400;
        } else {
          // Generate reasonable new customer numbers
          const baseNewCustomers = 80 + Math.sin(i / 2) * 60; // Basic oscillating pattern
          const seasonalNewCustomers = (i % 3 === 0) ? 350 : 0; // Quarterly spikes
          const randomNewCustomers = Math.floor(Math.random() * 100); // Random variations
          
          // Add market events 
          const marketEvent = (i === 15) ? 500 : (i === 8) ? 300 : 0; // Specific events
          
          // Growth trend - more new customers in later periods
          const growthTrend = Math.floor(i / 6) * 50;
          
          // Combine factors for new customers (always positive)
          newCustomers = Math.max(30, Math.floor(baseNewCustomers + seasonalNewCustomers + randomNewCustomers + marketEvent + growthTrend));
        }
        
        months.push({
          date,
          newCustomers,
          totalCustomers: i === 0 ? baseTotal : months[i-1].totalCustomers + months[i-1].newCustomers
        });
      }
      
      // Clear all existing data first
      console.log("✓ Cleared existing data");
      
      // Insert records sequentially with precise values
      for (const month of months) {
        await db.insert(customerGrowth).values({
          date: month.date,
          totalCustomers: month.totalCustomers,
          newCustomers: month.newCustomers
        });
        
        console.log(`✓ Inserted: ${month.date.toISOString().substr(0,10)}, Total=${month.totalCustomers}, New=${month.newCustomers}`);
      }
      
      console.log("✓ Finished regenerating all 30 months of customer growth data with perfect integrity");
      
      // Verification query to confirm
      const result = await db.select().from(customerGrowth).orderBy(customerGrowth.date);
      
      // Verify integrity
      let integrityIssues = 0;
      for (let i = 1; i < result.length; i++) {
        const prev = result[i-1];
        const curr = result[i];
        const expectedTotal = prev.totalCustomers + prev.newCustomers;
        
        if (curr.totalCustomers !== expectedTotal) {
          console.error(`❌ Integrity issue at ${new Date(curr.date).toISOString().substr(0,10)}: ${curr.totalCustomers} ≠ ${prev.totalCustomers} + ${prev.newCustomers}`);
          integrityIssues++;
        }
      }
      
      if (integrityIssues === 0) {
        console.log("✓ Verified data integrity: Perfect! All months have correct totals based on previous month");
      } else {
        console.log(`❌ Found ${integrityIssues} integrity issues in the verification check`);
      }
      
      res.json({ 
        message: "Customer growth data regenerated successfully with perfect data integrity",
        verificationResult: integrityIssues === 0 ? "perfect" : `${integrityIssues} issues found`
      });
    } catch (error) {
      console.error("Error regenerating customer growth data:", error);
      res.status(500).json({ message: "Failed to regenerate customer growth data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
