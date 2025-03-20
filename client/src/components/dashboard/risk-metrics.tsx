import React from 'react';

interface RiskMetric {
  id: number;
  name: string;
  current: string;
  previous: string;
  changePercent: number;
  status: string;
}

interface RiskMetricsProps {
  metrics: RiskMetric[];
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Metric</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Current</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Previous</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Change</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metrics.map((metric) => (
            <tr key={metric.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{metric.name}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-900">{metric.current}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-900">{metric.previous}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`text-sm ${metric.changePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {metric.changePercent >= 0 ? '+' : '-'}{Math.abs(metric.changePercent)}%
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  metric.status === 'Acceptable' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {metric.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskMetrics;
