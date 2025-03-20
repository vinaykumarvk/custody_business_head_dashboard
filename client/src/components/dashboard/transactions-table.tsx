import React from 'react';

interface Transaction {
  id: number;
  securityName: string;
  securityTicker: string;
  securityInitial: string;
  type: string;
  client: string;
  amount: number;
  status: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Security</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Client</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#7b7b7b] uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#C6DBFC] flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">{transaction.securityInitial}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{transaction.securityName}</p>
                    <p className="text-xs text-[#7b7b7b]">{transaction.securityTicker}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-900">{transaction.type}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-900">{transaction.client}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">
                  ${transaction.amount.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  transaction.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
