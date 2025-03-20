import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  subtitle?: string;
  change?: number;
  backgroundColor?: string;
  textColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  subtitle,
  change, 
  backgroundColor = 'white',
  textColor = '#2448a5'
}) => {
  const isPositive = change && change >= 0;
  
  return (
    <div className={`card ${backgroundColor} rounded-lg shadow p-5 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#7b7b7b] text-sm font-medium mb-1">{title}</h3>
          <p className={`text-2xl font-bold ${textColor} font-['Inter'] font-variant-numeric tabular-nums`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-[#7b7b7b] mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}></i>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-[#7b7b7b] ml-2">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-[#C6DBFC] rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;