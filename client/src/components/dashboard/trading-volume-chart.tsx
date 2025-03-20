import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { format, subMonths } from 'date-fns';

interface TradingVolumeData {
  date: string;
  volume: number;
}

interface TradingVolumeChartProps {
  data: TradingVolumeData[];
}

const TradingVolumeChart: React.FC<TradingVolumeChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y' | 'All'>('1Y');

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
    
    if (timeRange === '3M') {
      const last3Months = subMonths(now, 3);
      filteredData = data.filter(item => new Date(item.date) >= last3Months);
    } else if (timeRange === '6M') {
      const last6Months = subMonths(now, 6);
      filteredData = data.filter(item => new Date(item.date) >= last6Months);
    } else if (timeRange === '1Y') {
      const lastYear = subMonths(now, 12);
      filteredData = data.filter(item => new Date(item.date) >= lastYear);
    }
    // For 'All', use the complete dataset

    const labels = filteredData.map(item => format(new Date(item.date), 'MMM yyyy'));
    const volumes = filteredData.map(item => item.volume);

    // Calculate gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');  // Brighter blue with higher opacity
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Trading Volume',
          data: volumes,
          borderColor: '#3B82F6',
          backgroundColor: gradient,
          borderWidth: 4,  // Thicker line
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3B82F6',
          pointRadius: 0  // Remove points
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            beginAtZero: false,
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
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'line',
              pointStyleWidth: 16 // Make the line longer in the legend
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y + ' billion';
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
        <h2 className="text-lg font-semibold text-gray-900">Trading Volume</h2>
        <div className="flex space-x-2">
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
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${timeRange === 'All' ? 'bg-[#C6DBFC] text-[#2448a5]' : 'text-[#7b7b7b]'}`}
            onClick={() => setTimeRange('All')}
          >
            All
          </button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TradingVolumeChart;