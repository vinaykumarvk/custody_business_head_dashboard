import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// KPI Metrics schema
export const kpiMetrics = pgTable("kpi_metrics", {
  id: serial("id").primaryKey(),
  aum: numeric("aum").notNull(),
  transactions: integer("transactions").notNull(),
  clients: integer("clients").notNull(),
  revenue: numeric("revenue").notNull(),
  aumChangePercent: numeric("aum_change_percent").notNull(),
  transactionsChangePercent: numeric("transactions_change_percent").notNull(),
  clientsChangePercent: numeric("clients_change_percent").notNull(),
  revenueChangePercent: numeric("revenue_change_percent").notNull(),
  date: timestamp("date").notNull(),
});

export const insertKpiMetricsSchema = createInsertSchema(kpiMetrics).omit({
  id: true,
});

export type InsertKpiMetrics = z.infer<typeof insertKpiMetricsSchema>;
export type KpiMetrics = typeof kpiMetrics.$inferSelect;

// Asset Allocation schema
export const assetAllocations = pgTable("asset_allocations", {
  id: serial("id").primaryKey(),
  equities: numeric("equities").notNull(),
  fixedIncome: numeric("fixed_income").notNull(),
  cash: numeric("cash").notNull(),
  alternatives: numeric("alternatives").notNull(),
  date: timestamp("date").notNull(),
});

export const insertAssetAllocationSchema = createInsertSchema(assetAllocations).omit({
  id: true,
});

export type InsertAssetAllocation = z.infer<typeof insertAssetAllocationSchema>;
export type AssetAllocation = typeof assetAllocations.$inferSelect;

// Asset Performance schema
export const assetPerformance = pgTable("asset_performance", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  equityAssets: numeric("equity_assets").notNull(),
  fixedIncome: numeric("fixed_income").notNull(),
  year: integer("year").notNull(),
});

export const insertAssetPerformanceSchema = createInsertSchema(assetPerformance).omit({
  id: true,
});

export type InsertAssetPerformance = z.infer<typeof insertAssetPerformanceSchema>;
export type AssetPerformance = typeof assetPerformance.$inferSelect;

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  securityName: text("security_name").notNull(),
  securityTicker: text("security_ticker").notNull(),
  securityInitial: text("security_initial").notNull(),
  type: text("type").notNull(),
  client: text("client").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull(),
  date: timestamp("date").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Clients schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  initials: text("initials").notNull(),
  assets: numeric("assets").notNull(),
  changePercent: numeric("change_percent").notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Risk Metrics schema
export const riskMetrics = pgTable("risk_metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  current: text("current").notNull(),
  previous: text("previous").notNull(),
  changePercent: numeric("change_percent").notNull(),
  status: text("status").notNull(),
});

export const insertRiskMetricSchema = createInsertSchema(riskMetrics).omit({
  id: true,
});

export type InsertRiskMetric = z.infer<typeof insertRiskMetricSchema>;
export type RiskMetric = typeof riskMetrics.$inferSelect;

// Security Alerts schema
export const securityAlerts = pgTable("security_alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  timeAgo: text("time_ago").notNull(),
  severity: text("severity").notNull(), // 'critical', 'warning', 'info', 'success'
});

export const insertSecurityAlertSchema = createInsertSchema(securityAlerts).omit({
  id: true,
});

export type InsertSecurityAlert = z.infer<typeof insertSecurityAlertSchema>;
export type SecurityAlert = typeof securityAlerts.$inferSelect;
