import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import KpiCard from "@/components/dashboard/kpi-card";
import AssetPerformanceChart from "@/components/dashboard/asset-performance-chart";
import AssetAllocationChart from "@/components/dashboard/asset-allocation-chart";
import TransactionsTable from "@/components/dashboard/transactions-table";
import TopClients from "@/components/dashboard/top-clients";
import RiskMetrics from "@/components/dashboard/risk-metrics";
import SecurityAlerts from "@/components/dashboard/security-alerts";

export default function Dashboard() {
  const { data: kpiData, isLoading: isLoadingKpi, error: kpiError } = useQuery({
    queryKey: ['/api/kpi-metrics'],
  });

  const { data: allocationData, isLoading: isLoadingAllocation, error: allocationError } = useQuery({
    queryKey: ['/api/asset-allocation'],
  });

  const { data: performanceData, isLoading: isLoadingPerformance, error: performanceError } = useQuery({
    queryKey: ['/api/asset-performance'],
  });

  const { data: transactionsData, isLoading: isLoadingTransactions, error: transactionsError } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  const { data: clientsData, isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ['/api/top-clients'],
  });

  const { data: riskMetricsData, isLoading: isLoadingRiskMetrics, error: riskMetricsError } = useQuery({
    queryKey: ['/api/risk-metrics'],
  });

  const { data: securityAlertsData, isLoading: isLoadingSecurityAlerts, error: securityAlertsError } = useQuery({
    queryKey: ['/api/security-alerts'],
  });

  const renderErrorAlert = (message: string) => (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Custody Security Business Dashboard</h1>
      
      {kpiError && renderErrorAlert("Failed to load KPI metrics")}
      
      {/* KPI Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoadingKpi ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-5">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))
        ) : kpiData ? (
          <>
            <KpiCard 
              title="Assets Under Management"
              value={`$${kpiData.aum}B`}
              change={kpiData.aumChangePercent}
              icon="funds"
            />
            <KpiCard 
              title="Total Transactions"
              value={kpiData.transactions.toLocaleString()}
              change={kpiData.transactionsChangePercent}
              icon="exchange-funds"
            />
            <KpiCard 
              title="Active Clients"
              value={kpiData.clients.toLocaleString()}
              change={kpiData.clientsChangePercent}
              icon="user-star"
            />
            <KpiCard 
              title="Revenue"
              value={`$${kpiData.revenue}M`}
              change={kpiData.revenueChangePercent}
              icon="money-dollar-circle"
            />
          </>
        ) : null}
      </div>
      
      {/* Chart & Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        {performanceError && renderErrorAlert("Failed to load performance data")}
        <div className="card bg-white rounded-lg shadow p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-dark">Assets Performance Trend</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium bg-primary-light text-primary rounded-full">1M</button>
              <button className="px-3 py-1 text-xs font-medium text-[#7b7b7b] rounded-full">3M</button>
              <button className="px-3 py-1 text-xs font-medium text-[#7b7b7b] rounded-full">6M</button>
              <button className="px-3 py-1 text-xs font-medium text-[#7b7b7b] rounded-full">1Y</button>
            </div>
          </div>
          
          {isLoadingPerformance ? (
            <Skeleton className="h-80 w-full" />
          ) : performanceData ? (
            <AssetPerformanceChart data={performanceData} />
          ) : null}
        </div>
        
        {/* Asset Allocation Chart */}
        {allocationError && renderErrorAlert("Failed to load allocation data")}
        <div className="card bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-neutral-dark mb-4">Asset Allocation</h2>
          
          {isLoadingAllocation ? (
            <Skeleton className="h-60 w-full mb-4" />
          ) : allocationData ? (
            <AssetAllocationChart data={allocationData} />
          ) : null}
        </div>
      </div>
      
      {/* Recent Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Transactions Table */}
        {transactionsError && renderErrorAlert("Failed to load transactions")}
        <div className="card bg-white rounded-lg shadow p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-dark">Recent Transactions</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          {isLoadingTransactions ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : transactionsData ? (
            <TransactionsTable transactions={transactionsData} />
          ) : null}
        </div>
        
        {/* Top Clients */}
        {clientsError && renderErrorAlert("Failed to load clients data")}
        <div className="card bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-dark">Top Performing Clients</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          {isLoadingClients ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : clientsData ? (
            <TopClients clients={clientsData} />
          ) : null}
        </div>
      </div>
      
      {/* Risk Metrics & Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Metrics Table */}
        {riskMetricsError && renderErrorAlert("Failed to load risk metrics")}
        <div className="card bg-white rounded-lg shadow p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-dark">Risk Metrics</h2>
            <button className="text-sm text-primary font-medium">Export</button>
          </div>
          
          {isLoadingRiskMetrics ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : riskMetricsData ? (
            <RiskMetrics metrics={riskMetricsData} />
          ) : null}
        </div>
        
        {/* Security Alerts */}
        {securityAlertsError && renderErrorAlert("Failed to load security alerts")}
        <div className="card bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-neutral-dark">Security Alerts</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          {isLoadingSecurityAlerts ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : securityAlertsData ? (
            <SecurityAlerts alerts={securityAlertsData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
