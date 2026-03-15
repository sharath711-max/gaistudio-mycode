import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { formatCurrency, formatWeight } from '../../utils';
import { useCustomers } from '../../hooks/useCustomers';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Customer } from '../../types';

interface CustomerPageProps {
  onAdd: () => void;
}

export const CustomerPage = ({ onAdd }: CustomerPageProps) => {
  const { customers, loading } = useCustomers();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (customer) => (
        <div>
          <div className="font-bold text-zinc-100">{customer.name}</div>
          <div className="text-xs text-zinc-500 font-mono mt-0.5">ID: #{customer.id}</div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      className: 'text-zinc-400 font-mono'
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (customer) => (
        <span className="font-bold text-emerald-500">{formatCurrency(customer.balance)}</span>
      )
    },
    {
      key: 'weight_balance',
      label: 'Weight Bal. (G/S)',
      render: (customer) => (
        <span className="text-zinc-400 font-mono">
          {formatWeight(customer.gold_weight_balance)} / {formatWeight(customer.silver_weight_balance)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (customer) => (
        <div className="flex justify-end">
          <button className="text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
            View History
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-sm font-bold uppercase tracking-widest">Loading customers...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={filtered} 
          keyExtractor={(row) => row.id} 
          emptyMessage="No customers found."
        />
      )}
    </div>
  );
};
