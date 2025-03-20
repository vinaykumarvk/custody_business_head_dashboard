import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  subtitle?: string;
  change?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  category?: 'customers' | 'revenue';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  subtitle,
  change, 
  backgroundColor = 'white',
  textColor = '#2448a5',
  accentColor,
  category
}) => {
  const isPositive = change && change >= 0;
  
  // Default accent colors based on category if not provided
  let borderColor = accentColor;
  if (!borderColor) {
    if (category === 'customers') {
      borderColor = '#2448a5'; // Blue
    } else if (category === 'revenue') {
      borderColor = '#4caf50'; // Green for revenue
    } else {
      borderColor = '#2448a5'; // Default blue
    }
  }
  
  return (
    <div className="relative bg-white rounded-md shadow-sm p-5 transition-all hover:shadow-md overflow-hidden">
      {/* Colored left edge */}
      <div 
        className="absolute top-0 left-0 h-full w-1.5" 
        style={{ backgroundColor: borderColor }}
      ></div>
      
      <div className="flex justify-between items-start pl-3">
        <div>
          <h3 className="text-custodyGray text-sm font-medium mb-1 font-roboto">{title}</h3>
          <p className="text-2xl font-medium text-custodyBlue font-roboto font-variant-numeric tabular-nums">{value}</p>
          {subtitle && (
            <p className="text-xs text-custodyGray mt-1 font-roboto">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'} font-roboto`}>
                <i className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}></i>
                {isPositive ? '' : '('}{Math.abs(change)}%{isPositive ? '' : ')'}
              </span>
              <span className="text-xs text-custodyGray ml-2 font-roboto">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-custodyLightBlue rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;