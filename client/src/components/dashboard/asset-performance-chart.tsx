import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PerformanceData {
  labels: string[];
  equityAssets: number[];
  fixedIncome: number[];
}

interface AssetPerformanceChartProps {
  data: PerformanceData;
}

const AssetPerformanceChart: React.FC<AssetPerformanceChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Equity Assets',
            data: data.equityAssets,
            borderColor: '#2448a5',
            backgroundColor: 'rgba(36, 72, 165, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Fixed Income',
            data: data.fixedIncome,
            borderColor: '#C6DBFC',
            backgroundColor: 'rgba(198, 219, 252, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
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
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
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
  }, [data]);

  return (
    <div className="h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default AssetPerformanceChart;
