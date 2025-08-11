import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Clock, CheckCircle, XCircle, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import supabase from '@/lib/supabase';

// Types
interface Order {
  id: number;
  created_at: string;
  user_id: string;
  product_id: string;
  quantity: number;
  status: string;
  expired_at: string;
  total_amount: number;
  payment_url: string | null;
  ref: string;
  product_name?: string; // Add product name field
}

// Fetch orders function using supabase.functions.invoke (simplified for list only)
const fetchOrders = async (page: number = 1, limit: number = 10): Promise<{ orders: Order[]; totalCount: number }> => {
  try {
    const { data, error } = await supabase.functions.invoke('orders', {
      body: {
        page,
        limit
      }
    });

    if (error) {
      throw new Error(error.message || 'Failed to invoke orders function');
    }

    if (!data.success) {
      throw new Error(data.message || 'Orders function returned error');
    }

    return {
      orders: data.data || [],
      totalCount: data.pagination?.total || 0
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders');
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: <Clock className="w-3 h-3" />,
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'paid':
      case 'completed':
        return {
          variant: 'default' as const,
          icon: <CheckCircle className="w-3 h-3" />,
          color: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
      case 'failed':
        return {
          variant: 'destructive' as const,
          icon: <XCircle className="w-3 h-3" />,
          color: 'bg-red-100 text-red-800'
        };
      case 'expired':
        return {
          variant: 'outline' as const,
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          variant: 'outline' as const,
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
      {config.icon}
      {status}
    </Badge>
  );
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Loading skeleton for table
const TableSkeleton = ({ rows = 10 }: { rows?: number }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

// Improved Pagination component - Always show if totalCount > itemsPerPage
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalCount,
  itemsPerPage,
  onPageChange, 
  isLoading 
}: { 
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Show pagination if there are more items than items per page OR if totalPages > 1
  if (totalCount <= itemsPerPage && totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-gray-500">
        Menampilkan <span className="font-medium">{startItem}</span> sampai <span className="font-medium">{endItem}</span> dari <span className="font-medium">{totalCount}</span> pesanan
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Sebelumnya
        </Button>
        
        <div className="flex space-x-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// Main component
const OrderListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: () => fetchOrders(currentPage, itemsPerPage),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3, // Retry failed requests 3 times
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });

  const orders = data?.orders || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePayment = (paymentUrl: string | null) => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Error memuat data</h3>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error ? error.message : 'Terjadi kesalahan'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => refetch()} 
                className="w-full mt-4"
                variant="outline"
              >
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Pesanan</h1>
          </div>
          {totalCount > 0 && (
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              Total: <span className="font-medium">{totalCount}</span> pesanan
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={itemsPerPage} />
            </div>
          ) : orders && orders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Tanggal</TableHead>
                      <TableHead className="font-semibold">Referensi</TableHead>
                      <TableHead className="font-semibold">Produk</TableHead>
                      <TableHead className="font-semibold">Kuantitas</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Total</TableHead>
                      <TableHead className="font-semibold">Expired</TableHead>
                      <TableHead className="font-semibold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-600">
                          {order.ref}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {order.product_name || 'Unknown Product'}
                            </div>
                            <div className="font-mono text-xs text-gray-500">
                              ID: {order.product_id.substring(0, 8)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {order.expired_at ? formatDate(order.expired_at) : '-'}
                        </TableCell>
                        <TableCell>
                          {order.payment_url ? (
                            <Button
                              onClick={() => handlePayment(order.payment_url)}
                              size="sm"
                              className="h-8 px-3"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Link
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-6 border-t">
                {/* Show pagination if there are more than itemsPerPage items */}
                {(totalCount > itemsPerPage || totalPages > 1) && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                )}
                

              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Belum ada pesanan
                </h3>
                <p className="text-gray-600">
                  Pesanan Anda akan muncul di sini setelah Anda melakukan pemesanan.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderListPage;