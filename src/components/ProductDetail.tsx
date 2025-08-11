import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Users, Heart, Lock, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';

type ProductDetailProps = {
  product: Product;
  isPurchased?: boolean;
  isLoadingPurchase?: boolean;
  onPurchase?: () => void;
}

export default function ProductDetail({
  product,
  isPurchased = false,
  isLoadingPurchase = false,
  onPurchase
}: ProductDetailProps) {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  <Heart className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>

              {/* Overlay for unpurchased products */}
              {!isPurchased && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 p-3 rounded-full">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {
                isPurchased ? null : (
                  <div>
                    {(product.price || product.promo_price) && (
                      <div className="mb-4 flex items-center gap-3">
                        {product.promo_price ? (
                          <>
                            <span className="text-2xl font-bold text-red-600">{formatPrice(product.promo_price)}</span>
                            <span className="text-lg text-gray-500 line-through">{formatPrice(product.price)}</span>
                            <Badge className="bg-red-500 text-white">
                              Promo
                            </Badge>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              }


              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Status Section */}
              {isPurchased ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Template Sudah Dibeli!</h3>
                      <p className="text-green-100">Akses semua template di bawah ini</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Beli Template Ini</h3>
                        <p className="text-blue-100">Dapatkan akses ke semua template premium</p>
                      </div>
                    </div>
                    <Button
                      onClick={onPurchase}
                      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                      disabled={isLoadingPurchase}
                    >
                      {isLoadingPurchase ? 'Loading...' : 'Beli Sekarang'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Koleksi Template
            </h2>
            <p className="text-gray-600">
              {isPurchased
                ? "Pilih kategori dan buka template yang ingin digunakan"
                : "Preview template yang akan Anda dapatkan setelah pembelian"
              }
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {product.link_categories.sort((a, b) => a.order - b.order).map((category, categoryIndex) => (
              <Card key={categoryIndex} className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${!isPurchased ? 'opacity-75' : ''}`}>
                <CardHeader className="bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {category.name}
                          {!isPurchased && <Lock className="w-4 h-4 text-gray-400" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {category.links.length} template
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {category.links.sort((a, b) => a.order - b.order).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 transition-colors ${isPurchased ? 'hover:bg-gray-50' : 'bg-gray-50/50'
                        }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                          {item.name}
                          {!isPurchased && <Lock className="w-3 h-3 text-gray-400" />}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      {isPurchased ? (
                        <Button
                          size="sm"
                          className={`bg-gradient-to-r ${category.color} hover:opacity-90 text-white border-0 ml-4`}
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Buka
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-4 cursor-not-allowed opacity-50"
                          disabled
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Terkunci
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
