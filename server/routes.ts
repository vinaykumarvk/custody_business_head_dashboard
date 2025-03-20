import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
