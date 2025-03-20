import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { format, subMonths } from 'date-fns';

interface CustomerGrowthData {
  date: string;
  totalCustomers: number;
  newCustomers: number;
}

interface CustomerGrowthChartProps {
  data: CustomerGrowthData[];
}

const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Filter data based on selected time range
    const now = new Date();
    let filteredData = [...data];
    
    if (timeRange === '1M') {
      const lastMonth = subMonths(now, 1);
      filteredData = data.filter(item => new Date(item.date) >= lastMonth);
    } else if (timeRange === '3M') {
      const last3Months = subMonths(now, 3);
      filteredData = data.filter(item => new Date(item.date) >= last3Months);
    } else if (timeRange === '6M') {
      const last6Months = subMonths(now, 6);
      filteredData = data.filter(item => new Date(item.date) >= last6Months);
    }

    const labels = filteredData.map(item => format(new Date(item.date), 'MMM yyyy'));
    const totalCustomersData = filteredData.map(item => item.totalCustomers);
    const newCustomersData = filteredData.map(item => item.newCustomers);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Customers',
            data: totalCustomersData,
            borderColor: '#2448a5',
            backgroundColor: 'rgba(36, 72, 165, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 0,
            yAxisID: 'y'
          },
          {
            label: 'New Customers',
            data: newCustomersData,
            borderColor: '#C6DBFC',
            backgroundColor: 'rgba(198, 219, 252, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 0,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            title: {
              display: true,
              text: 'Total Customers'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'New Customers'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, timeRange]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Customer Growth</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === '1M' ? 'bg-[#C6DBFC] text-[#2448a5]' : 'text-[#7b7b7b]'}`}
            onClick={() => setTimeRange('1M')}
          >
            1M
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === '3M' ? 'bg-[#C6DBFC] text-[#2448a5]' : 'text-[#7b7b7b]'}`}
            onClick={() => setTimeRange('3M')}
          >
            3M
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === '6M' ? 'bg-[#C6DBFC] text-[#2448a5]' : 'text-[#7b7b7b]'}`}
            onClick={() => setTimeRange('6M')}
          >
            6M
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === '1Y' ? 'bg-[#C6DBFC] text-[#2448a5]' : 'text-[#7b7b7b]'}`}
            onClick={() => setTimeRange('1Y')}
          >
            1Y
          </button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;