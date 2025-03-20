import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface IncomeByService {
  id: number;
  serviceName: string;
  amount: string | number;
}

interface IncomeByServiceChartProps {
  data: IncomeByService[];
}

const IncomeByServiceChart: React.FC<IncomeByServiceChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = data.map(item => item.serviceName);
    const amounts = data.map(item => 
      typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount
    );
    const total = amounts.reduce((acc, curr) => acc + curr, 0);
    const percentages = amounts.map(amount => ((amount / total) * 100).toFixed(1));

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: amounts,
          backgroundColor: [
            '#2448a5',   // Blue
            '#C6DBFC',   // Light Blue
            '#7b7b7b',   // Gray
            '#90CAF9'    // Another shade of blue
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = percentages[context.dataIndex];
                return `${label}: $${value}M (${percentage}%)`;
              }
            }
          }
        },
        cutout: '65%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Income by Service</h2>
      <div className="h-60">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default IncomeByServiceChart;