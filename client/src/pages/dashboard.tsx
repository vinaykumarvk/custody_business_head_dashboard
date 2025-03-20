import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiUserPlus, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import MetricCard from '@/components/dashboard/metric-card';
import CustomerGrowthChart from '@/components/dashboard/customer-growth-chart';
import CustomerSegmentsChart from '@/components/dashboard/customer-segments-chart';
import TradingVolumeChart from '@/components/dashboard/trading-volume-chart';
import AucHistoryChart from '@/components/dashboard/auc-history-chart';
import IncomeHistoryChart from '@/components/dashboard/income-history-chart';
import IncomeByServiceChart from '@/components/dashboard/income-by-service-chart';
import TopCustomersTable from '@/components/dashboard/top-customers-table';

// Interface definitions for API responses
interface CustomerMetricsData {
  id: number;
  totalCustomers: number;
  activeCustomers: number;
  newCustomersMTD: number;
  date: string;
}

interface CustomerGrowthData {
  id: number;
  date: string;
  totalCustomers: number;
  newCustomers: number;
}

interface CustomerSegment {
  id: number;
  segmentName: string;
  percentage: string;
}

interface TradingVolumeData {
  id: number;
  date: string;
  volume: string;
}

interface AucHistoryData {
  id: number;
  date: string;
  equity: string;
  fixedIncome: string;
  mutualFunds: string;
  others: string;
}

interface AucMetricsData {
  id: number;
  totalAuc: string;
  equity: string;
  fixedIncome: string;
  mutualFunds: string;
  others: string;
  growth: string;
}

interface IncomeData {
  id: number;
  incomeMTD: string;
  outstandingFees: string;
  growth: string;
}

interface IncomeHistoryData {
  id: number;
  date: string;
  amount: string;
}

interface IncomeByService {
  id: number;
  serviceName: string;
  amount: string;
}

interface TopCustomer {
  id: number;
  name: string;
  customerType: string;
  revenue: string;
  assets: string;
  changePercent: string;
}

export default function Dashboard() {
  // Customer Metrics
  const { data: customerMetrics, isLoading: customerMetricsLoading, error: customerMetricsError } = useQuery<CustomerMetricsData>({
    queryKey: ['/api/customer-metrics'],
  });

  // Customer Growth
  const { data: customerGrowth, isLoading: customerGrowthLoading, error: customerGrowthError } = useQuery<CustomerGrowthData[]>({
    queryKey: ['/api/customer-growth'],
  });

  // Customer Segments
  const { data: customerSegments, isLoading: customerSegmentsLoading, error: customerSegmentsError } = useQuery<CustomerSegment[]>({
    queryKey: ['/api/customer-segments'],
  });

  // Trading Volume
  const { data: tradingVolume, isLoading: tradingVolumeLoading, error: tradingVolumeError } = useQuery<TradingVolumeData[]>({
    queryKey: ['/api/trading-volume'],
  });

  // AUC History
  const { data: aucHistory, isLoading: aucHistoryLoading, error: aucHistoryError } = useQuery<AucHistoryData[]>({
    queryKey: ['/api/auc-history'],
  });

  // AUC Metrics
  const { data: aucMetrics, isLoading: aucMetricsLoading, error: aucMetricsError } = useQuery<AucMetricsData>({
    queryKey: ['/api/auc-metrics'],
  });

  // Income data
  const { data: income, isLoading: incomeLoading, error: incomeError } = useQuery<IncomeData>({
    queryKey: ['/api/income'],
  });

  // Income by Service
  const { data: incomeByService, isLoading: incomeByServiceLoading, error: incomeByServiceError } = useQuery<IncomeByService[]>({
    queryKey: ['/api/income-by-service'],
  });

  // Income History
  const { data: incomeHistory, isLoading: incomeHistoryLoading, error: incomeHistoryError } = useQuery<IncomeHistoryData[]>({
    queryKey: ['/api/income-history'],
  });

  // Top Customers
  const { data: topCustomers, isLoading: topCustomersLoading, error: topCustomersError } = useQuery<TopCustomer[]>({
    queryKey: ['/api/top-customers'],
  });

  const formatNumberWithCommas = (value: number | string | undefined) => {
    if (value === undefined) return '';
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    return numValue.toLocaleString() || '';
  };

  const renderErrorAlert = (message: string) => (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  // Section header component
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-5 pb-2 border-b border-gray-200">
      <h2 className="text-xl font-medium text-custodyBlue font-roboto">{title}</h2>
    </div>
  );

  return (
    <div className="bg-custodyBackground min-h-screen font-roboto">
      <div className="container mx-auto px-4 py-4 w-full">
        {/* Display any errors */}
        {customerMetricsError && renderErrorAlert("Failed to load customer metrics")}
        {aucMetricsError && renderErrorAlert("Failed to load AUC metrics")}
        
        {/* CUSTOMERS SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <SectionHeader title="Customers" />
          
          {/* Customer Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {customerMetricsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-md shadow-sm p-5">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : (
              <>
                <MetricCard 
                  title="Total Customers" 
                  value={formatNumberWithCommas(customerMetrics?.totalCustomers)}
                  icon={<FiUsers size={24} color="#2448a5" />}
                  category="customers"
                />
                
                <MetricCard 
                  title="Active Customers" 
                  value={formatNumberWithCommas(customerMetrics?.activeCustomers)}
                  icon={<FiUsers size={24} color="#2448a5" />}
                  subtitle="Monthly active customers"
                  category="customers"
                />
                
                <MetricCard 
                  title="New Customers MTD" 
                  value={formatNumberWithCommas(customerMetrics?.newCustomersMTD)}
                  icon={<FiUserPlus size={24} color="#2448a5" />}
                  change={4.7}
                  category="customers"
                />
              </>
            )}
          </div>
          
          {customerGrowthError && renderErrorAlert("Failed to load customer growth data")}
          {customerSegmentsError && renderErrorAlert("Failed to load customer segments data")}
          
          {/* Customer Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="bg-white p-5 rounded-md shadow-sm col-span-2">
              {customerGrowthLoading ? (
                <div className="animate-pulse h-80 bg-gray-200 rounded-md"></div>
              ) : customerGrowth ? (
                <CustomerGrowthChart data={customerGrowth} />
              ) : null}
            </div>
            
            <div className="bg-white p-5 rounded-md shadow-sm">
              {customerSegmentsLoading ? (
                <div className="animate-pulse h-60 bg-gray-200 rounded-md"></div>
              ) : customerSegments ? (
                <CustomerSegmentsChart data={customerSegments} />
              ) : null}
            </div>
          </div>
          
          {/* Top Customers Table */}
          {topCustomersError && renderErrorAlert("Failed to load top customers data")}
          
          <div className="bg-white p-5 rounded-md shadow-sm">
            {topCustomersLoading ? (
              <div className="animate-pulse h-80 bg-gray-200 rounded-md"></div>
            ) : topCustomers ? (
              <TopCustomersTable customers={topCustomers} />
            ) : null}
          </div>
        </div>
        
        {/* REVENUE & ASSETS SECTION */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <SectionHeader title="Revenue & Assets" />
          
          {/* Revenue Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {aucMetricsLoading || incomeLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-md shadow-sm p-5">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : (
              <>
                <MetricCard 
                  title="AUC (Assets Under Custody)" 
                  value={`$${aucMetrics?.totalAuc}B`}
                  icon={<FiBarChart2 size={24} color="#4caf50" />}
                  change={parseFloat(aucMetrics?.growth)}
                  category="revenue"
                />
                
                <MetricCard 
                  title="Income MTD" 
                  value={`$${income?.incomeMTD}M`}
                  icon={<FiDollarSign size={24} color="#4caf50" />}
                  change={parseFloat(income?.growth)}
                  category="revenue"
                />
                
                <MetricCard 
                  title="Outstanding Fees" 
                  value={`$${income?.outstandingFees}M`}
                  icon={<FiDollarSign size={24} color="#4caf50" />}
                  subtitle="Pending collection"
                  category="revenue"
                />
              </>
            )}
          </div>
          
          {tradingVolumeError && renderErrorAlert("Failed to load trading volume data")}
          {aucHistoryError && renderErrorAlert("Failed to load AUC history data")}
          
          {/* Asset Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="bg-white p-5 rounded-md shadow-sm">
              {tradingVolumeLoading ? (
                <div className="animate-pulse h-80 bg-gray-200 rounded-md"></div>
              ) : tradingVolume ? (
                <TradingVolumeChart data={tradingVolume} />
              ) : null}
            </div>
            
            <div className="bg-white p-5 rounded-md shadow-sm">
              {aucHistoryLoading ? (
                <div className="animate-pulse h-80 bg-gray-200 rounded-md"></div>
              ) : aucHistory ? (
                <AucHistoryChart data={aucHistory} />
              ) : null}
            </div>
          </div>
          
          {incomeHistoryError && renderErrorAlert("Failed to load income history data")}
          {incomeByServiceError && renderErrorAlert("Failed to load income by service data")}
          
          {/* Income Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-md shadow-sm">
              {incomeHistoryLoading ? (
                <div className="animate-pulse h-80 bg-gray-200 rounded-md"></div>
              ) : incomeHistory ? (
                <IncomeHistoryChart data={incomeHistory} />
              ) : null}
            </div>
            
            <div className="bg-white p-5 rounded-md shadow-sm">
              {incomeByServiceLoading ? (
                <div className="animate-pulse h-60 bg-gray-200 rounded-md"></div>
              ) : incomeByService ? (
                <IncomeByServiceChart data={incomeByService} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
