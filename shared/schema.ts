import { pgTable, text, integer, numeric, timestamp, boolean, serial } from "drizzle-orm/pg-core";
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

// Customer metrics schema
export const customerMetrics = pgTable("customer_metrics", {
  id: serial("id").primaryKey(),
  totalCustomers: integer("total_customers").notNull(),
  activeCustomers: integer("active_customers").notNull(),
  newCustomersMTD: integer("new_customers_mtd").notNull(),
  date: timestamp("date").notNull(),
});

export const insertCustomerMetricsSchema = createInsertSchema(customerMetrics).omit({
  id: true,
});

export type InsertCustomerMetrics = z.infer<typeof insertCustomerMetricsSchema>;
export type CustomerMetrics = typeof customerMetrics.$inferSelect;

// Customer Growth schema
export const customerGrowth = pgTable("customer_growth", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalCustomers: integer("total_customers").notNull(),
  newCustomers: integer("new_customers").notNull(),
});

export const insertCustomerGrowthSchema = createInsertSchema(customerGrowth).omit({
  id: true,
});

export type InsertCustomerGrowth = z.infer<typeof insertCustomerGrowthSchema>;
export type CustomerGrowth = typeof customerGrowth.$inferSelect;

// Customer Segments schema
export const customerSegments = pgTable("customer_segments", {
  id: serial("id").primaryKey(),
  segmentName: text("segment_name").notNull(),
  percentage: numeric("percentage").notNull(),
});

export const insertCustomerSegmentsSchema = createInsertSchema(customerSegments).omit({
  id: true,
});

export type InsertCustomerSegments = z.infer<typeof insertCustomerSegmentsSchema>;
export type CustomerSegments = typeof customerSegments.$inferSelect;

// Trading Volume schema
export const tradingVolume = pgTable("trading_volume", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  volume: numeric("volume").notNull(),
});

export const insertTradingVolumeSchema = createInsertSchema(tradingVolume).omit({
  id: true,
});

export type InsertTradingVolume = z.infer<typeof insertTradingVolumeSchema>;
export type TradingVolume = typeof tradingVolume.$inferSelect;

// AUC History schema
export const aucHistory = pgTable("auc_history", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  equity: numeric("equity").notNull(),
  fixedIncome: numeric("fixed_income").notNull(),
  mutualFunds: numeric("mutual_funds").notNull(),
  others: numeric("others").notNull(),
});

export const insertAucHistorySchema = createInsertSchema(aucHistory).omit({
  id: true,
});

export type InsertAucHistory = z.infer<typeof insertAucHistorySchema>;
export type AucHistory = typeof aucHistory.$inferSelect;

// AUC Metrics schema
export const aucMetrics = pgTable("auc_metrics", {
  id: serial("id").primaryKey(),
  totalAuc: numeric("total_auc").notNull(),
  equity: numeric("equity").notNull(),
  fixedIncome: numeric("fixed_income").notNull(),
  mutualFunds: numeric("mutual_funds").notNull(),
  others: numeric("others").notNull(),
});

export const insertAucMetricsSchema = createInsertSchema(aucMetrics).omit({
  id: true,
});

export type InsertAucMetrics = z.infer<typeof insertAucMetricsSchema>;
export type AucMetrics = typeof aucMetrics.$inferSelect;

// Income schema
export const income = pgTable("income", {
  id: serial("id").primaryKey(),
  incomeMTD: numeric("income_mtd").notNull(),
  outstandingFees: numeric("outstanding_fees").notNull(),
});

export const insertIncomeSchema = createInsertSchema(income).omit({
  id: true,
});

export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type Income = typeof income.$inferSelect;

// Income by Service schema
export const incomeByService = pgTable("income_by_service", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(),
  amount: numeric("amount").notNull(),
});

export const insertIncomeByServiceSchema = createInsertSchema(incomeByService).omit({
  id: true,
});

export type InsertIncomeByService = z.infer<typeof insertIncomeByServiceSchema>;
export type IncomeByService = typeof incomeByService.$inferSelect;

// Income History schema
export const incomeHistory = pgTable("income_history", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  amount: numeric("amount").notNull(),
});

export const insertIncomeHistorySchema = createInsertSchema(incomeHistory).omit({
  id: true,
});

export type InsertIncomeHistory = z.infer<typeof insertIncomeHistorySchema>;
export type IncomeHistory = typeof incomeHistory.$inferSelect;

// Top Revenue Customers schema
export const topCustomers = pgTable("top_customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  customerType: text("customer_type").notNull(),
  revenue: numeric("revenue").notNull(),
  assets: numeric("assets").notNull(),
  changePercent: numeric("change_percent").notNull(),
});

export const insertTopCustomersSchema = createInsertSchema(topCustomers).omit({
  id: true,
});

export type InsertTopCustomers = z.infer<typeof insertTopCustomersSchema>;
export type TopCustomers = typeof topCustomers.$inferSelect;

// Monthly Customer Data schema - tracks customer segments by month
export const monthlyCustomerData = pgTable("monthly_customer_data", {
  id: serial("id").primaryKey(),
  month: timestamp("month").notNull(),
  institutional: integer("institutional").notNull(),
  corporate: integer("corporate").notNull(),
  hni: integer("hni").notNull(),
  funds: integer("funds").notNull(),
  activeCustomers: integer("active_customers").notNull(),
});

export const insertMonthlyCustomerDataSchema = createInsertSchema(monthlyCustomerData).omit({
  id: true,
});

export type InsertMonthlyCustomerData = z.infer<typeof insertMonthlyCustomerDataSchema>;
export type MonthlyCustomerData = typeof monthlyCustomerData.$inferSelect;

// Customer History schema
export const customerHistory = pgTable("customer_history", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  // Original fields
  totalCustomers: integer("total_customers").notNull(),
  newCustomers: integer("new_customers").notNull(),
  churnedCustomers: integer("churned_customers").notNull(),
  retentionRate: numeric("retention_rate").notNull(),
  acquisitionCost: numeric("acquisition_cost").notNull(),
  lifetimeValue: numeric("lifetime_value").notNull(),
  // New segment fields
  institutional: integer("institutional").notNull().default(0),
  corporate: integer("corporate").notNull().default(0),
  hni: integer("hni").notNull().default(0),
  funds: integer("funds").notNull().default(0),
  // Additional fields
  total: integer("total").notNull().default(0),
  new: integer("new").notNull().default(0),
  active: integer("active").notNull().default(0),
});

export const insertCustomerHistorySchema = createInsertSchema(customerHistory).omit({
  id: true,
});

export type InsertCustomerHistory = z.infer<typeof insertCustomerHistorySchema>;
export type CustomerHistory = typeof customerHistory.$inferSelect;
