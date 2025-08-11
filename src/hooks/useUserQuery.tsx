import supabase from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });
};

export default useUserQuery
