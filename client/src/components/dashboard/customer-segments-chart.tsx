import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface CustomerSegment {
  id: number;
  segmentName: string;
  percentage: string | number;
}

interface CustomerSegmentsChartProps {
  data: CustomerSegment[];
}

const CustomerSegmentsChart: React.FC<CustomerSegmentsChartProps> = ({ data }) => {
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

    const labels = data.map(segment => segment.segmentName);
    const percentages = data.map(segment => {
      // Convert percentage to number if it's a string
      return typeof segment.percentage === 'string' 
        ? parseFloat(segment.percentage) 
        : segment.percentage;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: percentages,
          backgroundColor: [
            '#2448a5',  // Blue
            '#C6DBFC',  // Light Blue
            '#7b7b7b',  // Gray
            '#90CAF9'   // Another shade of blue
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
              padding: 15,
              usePointStyle: true,
              pointStyle: 'rectRounded',
              pointStyleWidth: 16 // Maintain rectangular style for color indicators
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                return `${label}: ${value}%`;
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h2>
      <div className="h-60">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default CustomerSegmentsChart;