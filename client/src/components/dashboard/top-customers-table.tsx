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
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC]">
              <TableHead className="font-medium text-[#2448a5]">Customer</TableHead>
              <TableHead className="font-medium text-[#2448a5]">Type</TableHead>
              <TableHead className="font-medium text-[#2448a5] text-right">Revenue</TableHead>
              <TableHead className="font-medium text-[#2448a5] text-right">Assets</TableHead>
              <TableHead className="font-medium text-[#2448a5] text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const revenue = parseNumber(customer.revenue);
              const assets = parseNumber(customer.assets);
              const changePercent = parseNumber(customer.changePercent);
              
              return (
                <TableRow key={customer.id} className="hover:bg-[#F8FAFC]">
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.customerType}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    ${revenue.toFixed(2)}M
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${assets.toFixed(1)}B
                  </TableCell>
                  <TableCell className="text-right">
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