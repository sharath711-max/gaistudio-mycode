import React from 'react';
import { GoldTest } from '../../types';
import { formatWeight } from '../../utils';
import './PrintStyles.css';

interface ReceiptTemplateProps {
  test: GoldTest;
  type: 'gold' | 'silver';
}

export default function ReceiptTemplate({ test, type }: ReceiptTemplateProps) {
  return (
    <div className="thermal-slip">
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="font-bold text-xl mb-1">SWASTIK ASSAYERS</h1>
        <p className="text-xs uppercase tracking-widest">Item Receiving Slip</p>
      </div>

      {/* Meta Info */}
      <div className="mb-6 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="font-bold">Date:</span>
          <span>{new Date(test.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Test #:</span>
          <span className="uppercase">{test.test_number || `${type.substring(0, 1).toUpperCase()}T-${test.id.toString().padStart(5, '0')}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Customer:</span>
          <span>{test.customer_name}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-2 font-bold">Item Description</th>
            <th className="text-right py-2 font-bold">Gross Wt.</th>
          </tr>
        </thead>
        <tbody>
          {test.items?.map((item) => (
            <tr key={item.id} className="border-b border-black/20 border-dashed">
              <td className="py-2 pr-2">{item.name}</td>
              <td className="text-right py-2 font-bold">{formatWeight(item.gross_weight)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-black">
            <td className="py-2 font-bold text-right">Total Items:</td>
            <td className="py-2 font-bold text-right">{test.items?.length || 0}</td>
          </tr>
        </tfoot>
      </table>

      {/* Signatures */}
      <div className="mt-12 pt-4 border-t border-black text-center text-xs space-y-12">
        <div>
          <p className="border-t border-black/50 w-3/4 mx-auto pt-1">Customer Signature</p>
          <p className="text-[10px] text-gray-500 mt-1">I confirm the items and weights listed above.</p>
        </div>
        <div>
          <p className="border-t border-black/50 w-3/4 mx-auto pt-1">Lab Representative</p>
        </div>
      </div>
    </div>
  );
}
