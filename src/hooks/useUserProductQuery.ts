import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('user_products')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

const fetchTotalProducts = async () => {
  const { count, error } = await supabase
    .from('user_products')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
};

const useUserProductQuery = () => {
  const query = useQuery({
    queryKey: ['user_products'],
    queryFn: fetchProducts,
  });

  const totalQuery = useQuery({
    queryKey: ['total_products'],
    queryFn: fetchTotalProducts,
  });

  return {
    user_products: query.data,
    total: totalQuery.data,
  }
};

export default useUserProductQuery;
