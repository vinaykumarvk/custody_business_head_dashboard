import React from 'react';

interface Client {
  id: number;
  name: string;
  type: string;
  initials: string;
  assets: number;
  changePercent: number;
}

interface TopClientsProps {
  clients: Client[];
}

const TopClients: React.FC<TopClientsProps> = ({ clients }) => {
  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div key={client.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#C6DBFC] flex items-center justify-center">
              <span className="text-primary font-medium">{client.initials}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              <p className="text-xs text-[#7b7b7b]">{client.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">${client.assets}B</p>
            <p className="text-xs text-green-600">+{client.changePercent}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopClients;
