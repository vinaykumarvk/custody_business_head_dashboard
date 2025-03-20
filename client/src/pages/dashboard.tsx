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

export default function Dashboard() {
  // Customer Metrics
  const { data: customerMetrics, isLoading: customerMetricsLoading, error: customerMetricsError } = useQuery({
    queryKey: ['/api/customer-metrics'],
  });

  // Customer Growth
  const { data: customerGrowth, isLoading: customerGrowthLoading, error: customerGrowthError } = useQuery({
    queryKey: ['/api/customer-growth'],
  });

  // Customer Segments
  const { data: customerSegments, isLoading: customerSegmentsLoading, error: customerSegmentsError } = useQuery({
    queryKey: ['/api/customer-segments'],
  });

  // Trading Volume
  const { data: tradingVolume, isLoading: tradingVolumeLoading, error: tradingVolumeError } = useQuery({
    queryKey: ['/api/trading-volume'],
  });

  // AUC History
  const { data: aucHistory, isLoading: aucHistoryLoading, error: aucHistoryError } = useQuery({
    queryKey: ['/api/auc-history'],
  });

  // AUC Metrics
  const { data: aucMetrics, isLoading: aucMetricsLoading, error: aucMetricsError } = useQuery({
    queryKey: ['/api/auc-metrics'],
  });

  // Income data
  const { data: income, isLoading: incomeLoading, error: incomeError } = useQuery({
    queryKey: ['/api/income'],
  });

  // Income by Service
  const { data: incomeByService, isLoading: incomeByServiceLoading, error: incomeByServiceError } = useQuery({
    queryKey: ['/api/income-by-service'],
  });

  // Income History
  const { data: incomeHistory, isLoading: incomeHistoryLoading, error: incomeHistoryError } = useQuery({
    queryKey: ['/api/income-history'],
  });

  // Top Customers
  const { data: topCustomers, isLoading: topCustomersLoading, error: topCustomersError } = useQuery({
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

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {customerMetricsError && renderErrorAlert("Failed to load customer metrics")}
        {aucMetricsError && renderErrorAlert("Failed to load AUC metrics")}
        
        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {customerMetricsLoading || aucMetricsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-5">
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
              />
              
              <MetricCard 
                title="Active Customers" 
                value={formatNumberWithCommas(customerMetrics?.activeCustomers)}
                icon={<FiUsers size={24} color="#2448a5" />}
                subtitle="Monthly active customers"
              />
              
              <MetricCard 
                title="New Customers MTD" 
                value={formatNumberWithCommas(customerMetrics?.newCustomersMTD)}
                icon={<FiUserPlus size={24} color="#2448a5" />}
                change={4.7}
              />
              
              <MetricCard 
                title="AUC (Assets Under Custody)" 
                value={`$${aucMetrics?.totalAuc}B`}
                icon={<FiBarChart2 size={24} color="#2448a5" />}
                change={5.2}
              />
            </>
          )}
        </div>
        
        {customerGrowthError && renderErrorAlert("Failed to load customer growth data")}
        {customerSegmentsError && renderErrorAlert("Failed to load customer segments data")}
        
        {/* Second row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            {customerGrowthLoading ? (
              <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
            ) : customerGrowth ? (
              <CustomerGrowthChart data={customerGrowth} />
            ) : null}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            {customerSegmentsLoading ? (
              <div className="animate-pulse h-60 bg-gray-200 rounded"></div>
            ) : customerSegments ? (
              <CustomerSegmentsChart data={customerSegments} />
            ) : null}
          </div>
        </div>
        
        {tradingVolumeError && renderErrorAlert("Failed to load trading volume data")}
        {aucHistoryError && renderErrorAlert("Failed to load AUC history data")}
        
        {/* Third row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            {tradingVolumeLoading ? (
              <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
            ) : tradingVolume ? (
              <TradingVolumeChart data={tradingVolume} />
            ) : null}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            {aucHistoryLoading ? (
              <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
            ) : aucHistory ? (
              <AucHistoryChart data={aucHistory} />
            ) : null}
          </div>
        </div>
        
        {incomeError && renderErrorAlert("Failed to load income data")}
        
        {/* Income Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {incomeLoading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-5">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          ) : income ? (
            <>
              <MetricCard 
                title="Income MTD" 
                value={`$${income.incomeMTD}M`}
                icon={<FiDollarSign size={24} color="#2448a5" />}
                change={3.8}
              />
              
              <MetricCard 
                title="Outstanding Fees" 
                value={`$${income.outstandingFees}M`}
                icon={<FiDollarSign size={24} color="#2448a5" />}
                change={-2.1}
              />
              
              <div className="col-span-2">
                {/* Placeholder for future metrics */}
              </div>
            </>
          ) : null}
        </div>
        
        {incomeHistoryError && renderErrorAlert("Failed to load income history data")}
        {incomeByServiceError && renderErrorAlert("Failed to load income by service data")}
        
        {/* Fourth row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow col-span-2">
            {incomeHistoryLoading ? (
              <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
            ) : incomeHistory ? (
              <IncomeHistoryChart data={incomeHistory} />
            ) : null}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            {incomeByServiceLoading ? (
              <div className="animate-pulse h-60 bg-gray-200 rounded"></div>
            ) : incomeByService ? (
              <IncomeByServiceChart data={incomeByService} />
            ) : null}
          </div>
        </div>
        
        {topCustomersError && renderErrorAlert("Failed to load top customers data")}
        
        {/* Top Customers Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          {topCustomersLoading ? (
            <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
          ) : topCustomers ? (
            <TopCustomersTable customers={topCustomers} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
