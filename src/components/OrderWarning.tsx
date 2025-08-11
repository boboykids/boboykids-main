import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CreditCard, Clock } from 'lucide-react';
import useOrderQuery from '@/hooks/useOrderQuery';

export default function OrderWarning() {
  const [pending, setPending] = useState(null);

  const { data } = useOrderQuery();

  useEffect(() => {
    if (data) {
      const pending = data.find(
        item => item.status === 'pending' && Date.parse(item.expired_at) > Date.now()
      );
      setPending(pending);
    }
  }, [data]);
  if (!pending) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-amber-800">
                  Pesanan Menunggu Pembayaran
                </h3>
              </div>
              
              <div className="text-sm text-amber-700">
                <div className="hidden sm:block">
                  Anda memiliki pesanan yang menunggu pembayaran. 
                  Selesaikan pembayaran sebelum waktu habis.
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Detail pesanan untuk desktop */}
            <div className="hidden lg:flex items-center space-x-4">

            </div>

            {/* Tombol aksi */}
            <button onClick={() => window.open(pending.payment_url)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 shadow-sm">
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Bayar Sekarang</span>
              <span className="sm:hidden">Bayar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}