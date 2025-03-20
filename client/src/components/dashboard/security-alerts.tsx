import React from 'react';

interface SecurityAlert {
  id: number;
  title: string;
  description: string;
  timeAgo: string;
  severity: string;
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ alerts }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-primary bg-[#C6DBFC]';
      case 'success':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getTitleColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-primary';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`p-3 border-l-4 rounded-r-lg ${getSeverityStyles(alert.severity)}`}
        >
          <div className="flex justify-between">
            <h3 className={`text-sm font-medium ${getTitleColor(alert.severity)}`}>{alert.title}</h3>
            <span className="text-xs text-[#7b7b7b]">{alert.timeAgo}</span>
          </div>
          <p className="text-xs text-[#7b7b7b] mt-1">{alert.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SecurityAlerts;
