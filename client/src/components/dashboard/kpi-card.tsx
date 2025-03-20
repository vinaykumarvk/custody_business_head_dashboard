import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="card bg-white rounded-lg shadow p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#7b7b7b] text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-primary font-['Inter'] font-variant-numeric tabular-nums">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <i className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}></i>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-[#7b7b7b] ml-2">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-[#C6DBFC] rounded-full">
          <i className={`ri-${icon}-line text-primary text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
