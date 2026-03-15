import React, { useState, useEffect } from 'react';
import { IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StatCard, Card } from '../../components/common/Card';
import { formatCurrency } from '../../utils';

export const FinancePage = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Cash in Hand" value={formatCurrency(45200)} icon={IndianRupee} color="bg-emerald-500" />
      <StatCard label="Total Receivables" value={formatCurrency(12800)} icon={AlertCircle} color="bg-amber-500" />
      <StatCard label="Today's Collection" value={formatCurrency(8400)} icon={CheckCircle2} color="bg-blue-500" />
    </div>
    <Card title="Recent Transactions">
      <div className="text-center py-12 text-zinc-500">
        <IndianRupee size={48} className="mx-auto mb-4 opacity-20" />
        <p>No transactions found for today.</p>
      </div>
    </Card>
  </div>
);
