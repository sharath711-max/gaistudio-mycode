import React from 'react';
import { GoldTest } from '../../types';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateTemplateProps {
  test: GoldTest;
}

export default function GoldCertificateTemplate({ test }: CertificateTemplateProps) {
  const verificationUrl = `${window.location.origin}/verify/gold/${test.id}`;

  return (
    <div className="a4-certificate">
      <div className="text-center mb-12 border-b-4 border-amber-500 pb-8 flex justify-between items-center">
        <div className="w-24"></div> {/* Spacer for centering */}
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">SWASTIK ASSAYERS</h1>
          <h2 className="text-2xl text-gray-600 tracking-widest uppercase">Gold Purity Certificate</h2>
        </div>
        <div className="w-24 flex justify-end">
          <QRCodeSVG value={verificationUrl} size={80} level="M" />
        </div>
      </div>

      <div className="flex justify-between mb-12 text-sm">
        <div>
          <p><span className="font-bold w-32 inline-block">Certificate No:</span> {test.test_number ? `C${test.test_number}` : `GC-${test.id.toString().padStart(5, '0')}`}</p>
          <p><span className="font-bold w-32 inline-block">Date:</span> {new Date().toLocaleDateString()}</p>
        </div>
        <div>
          <p><span className="font-bold w-32 inline-block">Customer:</span> {test.customer_name}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-12">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-gray-300">
            <th className="py-3 px-4 font-bold">Item Description</th>
            <th className="py-3 px-4 font-bold text-right">Gross Weight (g)</th>
            <th className="py-3 px-4 font-bold text-right">Purity (%)</th>
            <th className="py-3 px-4 font-bold text-right">Fine Weight (g)</th>
          </tr>
        </thead>
        <tbody>
          {test.items?.map((item) => {
            const fineWeight = (item.gross_weight * (item.purity || 0)) / 100;
            return (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4 text-right">{item.gross_weight.toFixed(3)}</td>
                <td className="py-3 px-4 text-right font-bold">{item.purity?.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right font-bold text-amber-600">{fineWeight.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-32 pt-8 border-t-2 border-gray-300 flex justify-between text-sm font-bold">
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