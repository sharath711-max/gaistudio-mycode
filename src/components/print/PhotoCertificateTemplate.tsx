import React from 'react';
import { GoldTest } from '../../types';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateTemplateProps {
  test: GoldTest;
}

export default function PhotoCertificateTemplate({ test }: CertificateTemplateProps) {
  const verificationUrl = `${window.location.origin}/verify/photo/${test.id}`;

  return (
    <div className="a4-certificate">
      <div className="text-center mb-8 border-b-4 border-emerald-500 pb-6 flex justify-between items-center">
        <div className="w-24"></div> {/* Spacer for centering */}
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">SWASTIK ASSAYERS</h1>
          <h2 className="text-2xl text-gray-600 tracking-widest uppercase">Photo ID Certificate</h2>
        </div>
        <div className="w-24 flex justify-end">
          <QRCodeSVG value={verificationUrl} size={80} level="M" />
        </div>
      </div>

      <div className="flex gap-8 mb-8">
        <div className="w-1/3 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
          [Item Photo Placeholder]
        </div>
        <div className="w-2/3 text-sm space-y-2">
          <p><span className="font-bold w-32 inline-block">Certificate No:</span> {test.test_number ? `PC${test.test_number}` : `PC-${test.id.toString().padStart(5, '0')}`}</p>
          <p><span className="font-bold w-32 inline-block">Date:</span> {new Date().toLocaleDateString()}</p>
          <p><span className="font-bold w-32 inline-block">Customer:</span> {test.customer_name}</p>
          <p><span className="font-bold w-32 inline-block">Total Items:</span> {test.items?.length || 0}</p>
          <p><span className="font-bold w-32 inline-block">Total Weight:</span> {test.total_weight.toFixed(3)} g</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-12">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-gray-300">
            <th className="py-3 px-4 font-bold">Item Description</th>
            <th className="py-3 px-4 font-bold text-right">Gross Weight (g)</th>
            <th className="py-3 px-4 font-bold text-right">Purity (%)</th>
          </tr>
        </thead>
        <tbody>
          {test.items?.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3 px-4">{item.name}</td>
              <td className="py-3 px-4 text-right">{item.gross_weight.toFixed(3)}</td>
              <td className="py-3 px-4 text-right font-bold">{item.purity?.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-24 pt-8 border-t-2 border-gray-300 flex justify-between text-sm font-bold">
        <div className="text-center w-48">
          <p className="border-t border-black pt-2">Authorized Signatory</p>
        </div>
        <div className="text-center w-48">
          <p className="border-t border-black pt-2">Assayer</p>
        </div>
      </div>
    </div>
  );
}