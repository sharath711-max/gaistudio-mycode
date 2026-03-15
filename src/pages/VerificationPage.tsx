import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { GoldTest } from '../types';
import { apiClient } from '../services/apiClient';

export default function VerificationPage() {
  const [type, setType] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [test, setTest] = useState<GoldTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const parts = path.split('/');
    if (parts.length === 4 && parts[1] === 'verify') {
      setType(parts[2]);
      setId(parts[3]);
    } else {
      setLoading(false);
      setError('Invalid verification URL');
    }
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        // We need a public endpoint for verification, or we can just use the existing one if it doesn't require auth
        // For now, let's assume we have a public endpoint /api/verify/:type/:id
        const response = await apiClient.get(`/verify/${type}/${id}`);
        setTest(response.data);
      } catch (err) {
        console.error('Verification error:', err);
        setError('Could not verify this certificate. It may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchTest();
    }
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-zinc-500">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p>Verifying Certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-red-500">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Verification Failed</h1>
          <p className="text-zinc-600 mb-8">{error || 'Certificate not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-t-4 border-emerald-500">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2 text-center">Verified Authentic</h1>
        <p className="text-zinc-500 text-center mb-8">This certificate was issued by Swastik Assayers.</p>

        <div className="space-y-4">
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-zinc-500">Number:</span>
              <span className="font-medium text-zinc-900 text-right">
                {test.test_number || `${type === 'gold' ? 'GC' : type === 'silver' ? 'SC' : 'PC'}-${test.id.toString().padStart(5, '0')}`}
              </span>
              <span className="text-zinc-500">Date:</span>
              <span className="font-medium text-zinc-900 text-right">{new Date(test.created_at).toLocaleDateString()}</span>
              <span className="text-zinc-500">Customer:</span>
              <span className="font-medium text-zinc-900 text-right">{test.customer_name}</span>
              <span className="text-zinc-500">Items:</span>
              <span className="font-medium text-zinc-900 text-right">{test.items?.length || 0}</span>
              <span className="text-zinc-500">Total Weight:</span>
              <span className="font-medium text-zinc-900 text-right">{test.total_weight.toFixed(3)} g</span>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Item Breakdown</h3>
            <div className="space-y-3">
              {test.items?.map((item, index) => (
                <div key={item.id} className={index > 0 ? 'pt-3 border-t border-zinc-200' : ''}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-zinc-900 text-sm">{item.name}</span>
                    <span className="font-bold text-emerald-600 text-sm">{item.purity?.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Gross: {item.gross_weight.toFixed(3)}g</span>
                    <span>Fine: {((item.gross_weight * (item.purity || 0)) / 100).toFixed(3)}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
