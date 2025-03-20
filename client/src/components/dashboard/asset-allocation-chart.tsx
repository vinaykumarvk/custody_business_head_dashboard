import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface AllocationData {
  equities: number;
  fixedIncome: number;
  cash: number;
  alternatives: number;
}

interface AssetAllocationChartProps {
  data: AllocationData;
}

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
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
      type: 'doughnut',
      data: {
        labels: ['Equities', 'Fixed Income', 'Cash', 'Alternatives'],
        datasets: [{
          data: [data.equities, data.fixedIncome, data.cash, data.alternatives],
          backgroundColor: [
            '#2448a5',
            '#C6DBFC',
            '#7b7b7b',
            '#90CAF9'
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
            display: false
          }
        },
        cutout: '70%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <>
      <div className="h-60 mb-4">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#2448a5] mr-2"></div>
          <span className="text-sm text-[#7b7b7b]">Equities</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#C6DBFC] mr-2"></div>
          <span className="text-sm text-[#7b7b7b]">Fixed Income</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#7b7b7b] mr-2"></div>
          <span className="text-sm text-[#7b7b7b]">Cash</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
          <span className="text-sm text-[#7b7b7b]">Alternatives</span>
        </div>
      </div>
    </>
  );
};

export default AssetAllocationChart;
