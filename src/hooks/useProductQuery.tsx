import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

const useProductQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export default useProductQuery;
