import ProductDetail from "@/components/ProductDetail";
import Header from '@/components/DashboardHeader';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import OrderWarning from "@/components/OrderWarning";
import useUserQuery from "@/hooks/useUserQuery";
import { useState, useEffect } from "react";

// Countdown Timer Component
const CountdownTimer = ({ endDate }: { endDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p className="font-semibold">Promo telah berakhir!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 mb-4 shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">⏰ Promo Berakhir Dalam:</h3>
        <div className="flex justify-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">Hari</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm">Jam</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm">Menit</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 min-w-[60px]">
            <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm">Detik</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const push = useNavigate();
  const queryUser = useUserQuery();
  const user = queryUser.data;
  const isAuthenticated = !!user;
  
  const { data: product } = useQuery({
    queryKey: ['product', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          link_categories(
            *,
            links(
              name
            )
            )
        `)
        .eq('slug', id)
        .single();
  
      if (error) throw new Error(error.message);
  
      if (data?.product?.link_categories) {
        data.product.link_categories.forEach(category => {
          if (category.links) {
            category.links.sort((a, b) => a.order - b.order);
          }
        });
      }
  
      return data;
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ product_id }: { product_id: string  }) => {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: { product_id, quantity: 1 },
      });
      if (error) throw error;
      return data;
    },
    onError: () => {
      alert('Gagal, silahkan coba lagi atau hubungi admin');
    },
    onSuccess: (res) => {
      window.location.href = res.payment_url;
    }
  });

  const handlePurchase = async () => {
    if (isAuthenticated) {
      mutate({ product_id: product.id })
    } else {
      push(`/register?callback=${encodeURIComponent(`/product/${id}`)}`);
    }
  }

  return (
    <div>
      <Header />
      <OrderWarning />
      {
        product && (
          <div>
            {/* Show countdown timer if promotion is active */}
            {product.is_countdown_promotion && product.promo_end_at && (
              <div>
                <CountdownTimer endDate={product.promo_end_at} />
              </div>
            )}
            
            <ProductDetail
              product={product}
              isPurchased={false}
              onPurchase={handlePurchase}
              isLoadingPurchase={isPending}
            />
          </div>
        )
      }
    </div>
  )
}