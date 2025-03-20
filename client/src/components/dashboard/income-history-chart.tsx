import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { format, subMonths } from 'date-fns';

interface IncomeHistoryData {
  date: string;
  amount: number;
}

interface IncomeHistoryChartProps {
  data: IncomeHistoryData[];
}

const IncomeHistoryChart: React.FC<IncomeHistoryChartProps> = ({ data }) => {
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
    const amounts = filteredData.map(item => item.amount);

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(36, 72, 165, 0.7)');
    gradient.addColorStop(1, 'rgba(36, 72, 165, 0.0)');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Income (in millions USD)',
          data: amounts,
          backgroundColor: gradient,
          borderColor: '#2448a5',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6
        }]
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
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value + 'M';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y.toFixed(2) + ' million';
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
        <h2 className="text-lg font-semibold text-gray-900">Income History</h2>
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

export default IncomeHistoryChart;