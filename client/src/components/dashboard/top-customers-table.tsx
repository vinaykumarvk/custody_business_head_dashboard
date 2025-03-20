import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TopCustomer {
  id: number;
  name: string;
  customerType: string;
  revenue: string | number;
  assets: string | number;
  changePercent: string | number;
}

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  // Helper function to safely parse numeric values
  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value);
  };

  return (
    <div className="max-w-2/3 mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EBF4FF] border-b-2 border-[#2448a5]">
              <TableHead className="font-bold text-[#2448a5] py-4 text-base">Customer</TableHead>
              <TableHead className="font-bold text-[#2448a5] py-4 text-base">Type</TableHead>
              <TableHead className="font-bold text-[#2448a5] py-4 text-base text-right">Revenue</TableHead>
              <TableHead className="font-bold text-[#2448a5] py-4 text-base text-right">Assets</TableHead>
              <TableHead className="font-bold text-[#2448a5] py-4 text-base text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => {
              const revenue = parseNumber(customer.revenue);
              const assets = parseNumber(customer.assets);
              const changePercent = parseNumber(customer.changePercent);
              
              return (
                <TableRow 
                  key={customer.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} hover:bg-[#EBF4FF]`}
                >
                  <TableCell className="font-medium py-3">{customer.name}</TableCell>
                  <TableCell className="py-3">{customer.customerType}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums py-3">
                    ${revenue.toFixed(2)}M
                  </TableCell>
                  <TableCell className="text-right tabular-nums py-3">
                    ${assets.toFixed(1)}B
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <span className={`inline-flex items-center ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <i className={`ri-arrow-${changePercent >= 0 ? 'up' : 'down'}-line mr-1`}></i>
                      {Math.abs(changePercent).toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopCustomersTable;