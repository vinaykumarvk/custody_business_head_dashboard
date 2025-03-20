import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { format, subMonths } from 'date-fns';

interface AucHistoryData {
  date: string;
  equity: number;
  fixedIncome: number;
  mutualFunds: number;
  others: number;
}

interface AucHistoryChartProps {
  data: AucHistoryData[];
}

const AucHistoryChart: React.FC<AucHistoryChartProps> = ({ data }) => {
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
    
    // Calculate stacked data
    const equityData = filteredData.map(item => item.equity);
    const fixedIncomeData = filteredData.map(item => item.fixedIncome);
    const mutualFundsData = filteredData.map(item => item.mutualFunds);
    const othersData = filteredData.map(item => item.others);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Equity',
            data: equityData,
            backgroundColor: '#2448a5', // Blue
            stack: 'Stack 0'
          },
          {
            label: 'Fixed Income',
            data: fixedIncomeData,
            backgroundColor: '#C6DBFC', // Light Blue
            stack: 'Stack 0'
          },
          {
            label: 'Mutual Funds',
            data: mutualFundsData,
            backgroundColor: '#7b7b7b', // Gray
            stack: 'Stack 0'
          },
          {
            label: 'Others',
            data: othersData,
            backgroundColor: '#90CAF9', // Another shade of blue
            stack: 'Stack 0'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value + 'B';
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + context.parsed.y + ' billion';
              }
            }
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
        <h2 className="text-lg font-semibold text-gray-900">AUC History</h2>
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

export default AucHistoryChart;