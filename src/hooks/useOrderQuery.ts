import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/supabase';

const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const useOrderQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchOnMount: true,
    refetchInterval: 10000,
  });
};

export default useOrderQuery;
