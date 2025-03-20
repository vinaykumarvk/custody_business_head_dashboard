import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  
  // KPI Metrics endpoint
  app.get("/api/kpi-metrics", async (_req, res) => {
    try {
      const metrics = {
        aum: 8.72,
        transactions: 142857,
        clients: 3248,
        revenue: 24.5,
        aumChangePercent: 4.2,
        transactionsChangePercent: 7.8,
        clientsChangePercent: 2.5,
        revenueChangePercent: -1.2
      };
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPI metrics" });
    }
  });

  // Asset Allocation endpoint
  app.get("/api/asset-allocation", async (_req, res) => {
    try {
      const allocation = {
        equities: 45,
        fixedIncome: 30,
        cash: 15,
        alternatives: 10
      };
      
      res.json(allocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset allocation" });
    }
  });

  // Asset Performance endpoint
  app.get("/api/asset-performance", async (_req, res) => {
    try {
      const performance = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        equityAssets: [8.2, 8.1, 8.3, 8.7, 8.9, 9.1, 9.3, 9.4, 9.6, 9.8, 10.1, 10.4],
        fixedIncome: [4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4]
      };
      
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset performance" });
    }
  });

  // Recent Transactions endpoint
  app.get("/api/transactions", async (_req, res) => {
    try {
      const transactions = [
        {
          id: 1,
          securityName: "Microsoft Corp.",
          securityTicker: "MSFT",
          securityInitial: "M",
          type: "Purchase",
          client: "GlobalTech Funds",
          amount: 1245000,
          status: "Completed"
        },
        {
          id: 2,
          securityName: "Apple Inc.",
          securityTicker: "AAPL",
          securityInitial: "A",
          type: "Sale",
          client: "SilverWing Pension",
          amount: 876500,
          status: "Completed"
        },
        {
          id: 3,
          securityName: "US Treasury Bond",
          securityTicker: "10Y",
          securityInitial: "T",
          type: "Purchase",
          client: "Horizon Insurance",
          amount: 2450000,
          status: "Pending"
        },
        {
          id: 4,
          securityName: "Amazon.com Inc.",
          securityTicker: "AMZN",
          securityInitial: "A",
          type: "Purchase",
          client: "BlueRock Asset Mgmt",
          amount: 935000,
          status: "Completed"
        }
      ];
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Top Performing Clients endpoint
  app.get("/api/top-clients", async (_req, res) => {
    try {
      const clients = [
        {
          id: 1,
          name: "GlobalTech Funds",
          type: "Institutional",
          initials: "GT",
          assets: 2.4,
          changePercent: 12.5
        },
        {
          id: 2,
          name: "SilverWing Pension",
          type: "Pension Fund",
          initials: "SW",
          assets: 1.8,
          changePercent: 9.2
        },
        {
          id: 3,
          name: "Horizon Insurance",
          type: "Insurance",
          initials: "HI",
          assets: 1.2,
          changePercent: 7.8
        },
        {
          id: 4,
          name: "BlueRock Asset Mgmt",
          type: "Asset Manager",
          initials: "BR",
          assets: 0.985,
          changePercent: 6.5
        }
      ];
      
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top clients" });
    }
  });

  // Risk Metrics endpoint
  app.get("/api/risk-metrics", async (_req, res) => {
    try {
      const riskMetrics = [
        {
          id: 1,
          name: "Value at Risk (VaR)",
          current: "$124.5M",
          previous: "$118.3M",
          changePercent: 5.2,
          status: "Monitor"
        },
        {
          id: 2,
          name: "Sharpe Ratio",
          current: "1.42",
          previous: "1.38",
          changePercent: 2.9,
          status: "Acceptable"
        },
        {
          id: 3,
          name: "Volatility",
          current: "12.4%",
          previous: "11.8%",
          changePercent: 5.1,
          status: "Monitor"
        },
        {
          id: 4,
          name: "Liquidity Ratio",
          current: "1.85",
          previous: "1.72",
          changePercent: 7.6,
          status: "Acceptable"
        }
      ];
      
      res.json(riskMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk metrics" });
    }
  });

  // Security Alerts endpoint
  app.get("/api/security-alerts", async (_req, res) => {
    try {
      const securityAlerts = [
        {
          id: 1,
          title: "Critical Risk Threshold Exceeded",
          description: "Portfolio D-27 exposure to technology sector exceeds 35% threshold.",
          timeAgo: "2h ago",
          severity: "critical"
        },
        {
          id: 2,
          title: "Settlement Delay Warning",
          description: "International bond transaction settlement delayed by 24 hours.",
          timeAgo: "4h ago",
          severity: "warning"
        },
        {
          id: 3,
          title: "Account Access Notification",
          description: "New device login detected for admin account. Please verify.",
          timeAgo: "8h ago",
          severity: "info"
        },
        {
          id: 4,
          title: "Regulatory Compliance Update",
          description: "All client accounts successfully updated to comply with new regulations.",
          timeAgo: "1d ago",
          severity: "success"
        }
      ];
      
      res.json(securityAlerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security alerts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
