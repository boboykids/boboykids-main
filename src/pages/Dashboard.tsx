import React, { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import Header from '@/components/DashboardHeader';
import ProductCard from '@/components/ProductCard';
import StatsCard from '@/components//StatsCard';
import useProductQuery from '@/hooks/useProductQuery';
import useUserProductQuery from '@/hooks/useUserProductQuery';
import OrderWarning from '@/components/OrderWarning';

const Dashboard: React.FC = () => {
  const { data } = useProductQuery();

  const userProductQuery = useUserProductQuery();


  const products = data?.map((item) => {
    const userProduct = userProductQuery?.user_products?.find((u) => u.product_id === item.id);
    if (userProduct) {
      item.user_product_id = userProduct.id;
    }
    return item;
  }) || []

  const userProducts = products.filter((item) => item.user_product_id);
  const appProducts = products.filter((item) => !item.user_product_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <OrderWarning />
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard Produk Digital</h1>
          <p className="text-lg text-slate-600">Kelola dan akses semua produk digital yang telah Anda beli</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <StatsCard
            title="Produk Saya"
            value={userProductQuery.total}
            icon={Package}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
        </div>

        {/* Products Grid */}
        {userProducts.length > 0 ? (
          <div className='mb-6'>
            <h3 className='font-semibold text-2xl mb-8'>Produk Saya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          </div>
        ) : null}
        {appProducts.length > 0 ? (
          <div>
            <h3 className='font-semibold text-2xl mb-4'>Produk Belum di Beli</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;