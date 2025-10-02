import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Eye,
  Clock,
} from 'lucide-react';
import { Product } from '@/types';
import { STATUS_CONFIG, TYPE_ICONS } from '@/constants';
import { formatPrice } from '@/lib/format';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const statusConfig = STATUS_CONFIG[product.status || 'not-started'];
  const TypeIcon = TYPE_ICONS[product.type || 'Template'] || TYPE_ICONS.Template;
  const navigate = useNavigate();

  // State untuk countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate discount percentage if promo price exists
  const discountPercentage = product.promo_price && product.price
    ? Math.round(((product.price - product.promo_price) / product.price) * 100)
    : 0;

  // Check if product is not purchased and has countdown promotion
  const isUnpurchased = !product.user_product_id;
  const hasCountdownPromo = isUnpurchased && product.is_countdown_promotion && product.promo_end_at;

  // Countdown effect
  useEffect(() => {
    if (!hasCountdownPromo) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(product.promo_end_at).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [hasCountdownPromo, product.promo_end_at]);

  // Check if countdown has ended
  const countdownEnded = hasCountdownPromo &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const isPurchased = product.user_product_id;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <div className="relative aspect-square w-full  mx-auto overflow-hidden">

          <img
            src={product.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
            aria-hidden="true"
          />
          <img
            src={product.image_url}
            alt={product.name}
            className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {product.promo_price && discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xl font-bold">
              -{discountPercentage}%
            </span>
          )}
          {hasCountdownPromo && !countdownEnded && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              PROMO TERBATAS
            </div>
          )}
        </div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
          <TypeIcon className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Countdown Timer untuk produk yang belum dibeli */}
        {hasCountdownPromo && !countdownEnded && (
          <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Promo berakhir dalam:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-red-600 text-white rounded-lg py-2">
                <div className="text-lg font-bold">{timeLeft.days}</div>
                <div className="text-xs">Hari</div>
              </div>
              <div className="bg-red-600 text-white rounded-lg py-2">
                <div className="text-lg font-bold">{timeLeft.hours}</div>
                <div className="text-xs">Jam</div>
              </div>
              <div className="bg-red-600 text-white rounded-lg py-2">
                <div className="text-lg font-bold">{timeLeft.minutes}</div>
                <div className="text-xs">Menit</div>
              </div>
              <div className="bg-red-600 text-white rounded-lg py-2">
                <div className="text-lg font-bold">{timeLeft.seconds}</div>
                <div className="text-xs">Detik</div>
              </div>
            </div>
          </div>
        )}

        {/* Pesan jika countdown sudah berakhir */}
        {!isPurchased && hasCountdownPromo && countdownEnded && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Promo telah berakhir</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
            {product.type}
          </span>
          {
            isPurchased ? null : (
              <div className="text-right">
                {product.promo_price ? (
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.promo_price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            )
          }
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (product.user_product_id) {
                navigate(`/user-product?id=${product.user_product_id}`);
              } else {
                navigate(`/product/${product.slug}`);
              }
            }}
            className={cn(`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl`, {
              'bg-gradient-to-r from-blue-600 to-purple-800': product.user_product_id,
              'bg-gradient-to-r from-green-600 to-green-800': !product.user_product_id && !hasCountdownPromo,
              'bg-gradient-to-r from-blue-600 to-blue-800': hasCountdownPromo && !countdownEnded,
              'bg-gradient-to-r from-gray-600 to-gray-800': hasCountdownPromo && countdownEnded,
            })}>
            {
              product.user_product_id ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat
                </>
              ) : hasCountdownPromo && !countdownEnded ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Beli Sekarang!
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Beli
                </>
              )
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;