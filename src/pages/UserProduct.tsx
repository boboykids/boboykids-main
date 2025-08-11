import ProductDetail from "@/components/ProductDetail";
import Header from '@/components/DashboardHeader';
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";

export default function UserProductPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { data } = useQuery({
    queryKey: ['user_product', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_products')
        .select(`
          *,
          product:products(
            *,
            link_categories(
              *,
              links(
                *
              )
            )
          )
        `)
        .eq('id', id)
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



  return (
    <div>
      <Header />
      {
        data && (
          <ProductDetail
            product={data.product}
            isPurchased={true}
          />
        )
      }
    </div>
  )
}
