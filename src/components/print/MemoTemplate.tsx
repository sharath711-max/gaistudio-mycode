import React from 'react';
import { GoldTest } from '../../types';
import { formatWeight } from '../../utils';
import './PrintStyles.css';

interface MemoTemplateProps {
  test: GoldTest;
  type: 'gold' | 'silver';
}

export default function MemoTemplate({ test, type }: MemoTemplateProps) {
  return (
    <div className="thermal-slip">
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="font-bold text-xl mb-1">SWASTIK ASSAYERS</h1>
        <p className="text-xs uppercase tracking-widest">Internal Lab Memo</p>
      </div>

      {/* Meta Info */}
      <div className="mb-6 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="font-bold">Printed:</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Test #:</span>
          <span className="uppercase">{test.test_number || `${type.substring(0, 1).toUpperCase()}T-${test.id.toString().padStart(5, '0')}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Status:</span>
          <span className="uppercase">{test.status}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-xs mb-8">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-2 font-bold">Item</th>
            <th className="text-right py-2 font-bold">Lab Wt.</th>
            <th className="text-right py-2 font-bold">Purity</th>
          </tr>
        </thead>
        <tbody>
          {test.items?.map((item) => (
            <tr key={item.id} className="border-b border-black/20 border-dashed">
              <td className="py-2 pr-1">{item.name}</td>
              <td className="text-right py-2">{formatWeight(item.test_weight)}</td>
              <td className="text-right py-2 font-bold">{item.purity}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signatures */}
      <div className="mt-12 pt-4 border-t border-black text-center text-xs space-y-12">
        <div>
          <p className="border-t border-black/50 w-3/4 mx-auto pt-1">Assayer Signature</p>
        </div>
      </div>
    </div>
  );
}
