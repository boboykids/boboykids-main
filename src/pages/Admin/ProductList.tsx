import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus, Eye, Loader2, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promo_price: number;
  type: string;
  image_url?: string;
  slug: string;
  is_countdown_promotion: boolean;
  promo_end_at?: string;
  created_at?: string;
  link_categories?: LinkCategory[];
}

interface LinkCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  product_id: string;
  links?: Link[];
}

interface Link {
  id: string;
  name: string;
  url: string;
  description?: string;
  order: number;
  category_id: string;
}

// API Functions
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      link_categories(
        *,
        links(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'link_categories'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

// Product Form Dialog Component
const ProductFormDialog = ({ 
  isOpen, 
  onClose, 
  editingProduct 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  editingProduct: Product | null; 
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promo_price: '',
    type: 'Template',
    image_url: '',
    slug: '',
    is_countdown_promotion: false,
    promo_end_at: ''
  });

  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        promo_price: editingProduct.promo_price?.toString() || '',
        type: editingProduct.type,
        image_url: editingProduct.image_url || '',
        slug: editingProduct.slug,
        is_countdown_promotion: editingProduct.is_countdown_promotion || false,
        promo_end_at: editingProduct.promo_end_at ? new Date(editingProduct.promo_end_at).toISOString().slice(0, 16) : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        promo_price: '',
        type: 'Template',
        image_url: '',
        slug: '',
        is_countdown_promotion: false,
        promo_end_at: ''
      });
    }
  }, [editingProduct, isOpen]);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Produk berhasil ditambahkan!' });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Produk berhasil diupdate!' });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast({ title: 'Error', description: 'Mohon lengkapi field yang wajib diisi', variant: 'destructive' });
      return;
    }

    // Validate countdown promotion
    if (formData.is_countdown_promotion && !formData.promo_end_at) {
      toast({ title: 'Error', description: 'Mohon set tanggal berakhir promo untuk countdown promotion', variant: 'destructive' });
      return;
    }

    const productData = {
      ...formData,
      price: parseInt(formData.price) || 0,
      promo_price: parseInt(formData.promo_price) || 0,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      promo_end_at: formData.promo_end_at ? new Date(formData.promo_end_at).toISOString() : null
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingProduct ? 'Ubah informasi produk' : 'Isi informasi produk baru'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama produk"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Masukkan deskripsi produk"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Harga Normal *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="199000"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="promo_price">Harga Promo</Label>
              <Input
                id="promo_price"
                type="number"
                value={formData.promo_price}
                onChange={(e) => setFormData(prev => ({ ...prev, promo_price: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Countdown Promotion Section */}
          <div className="grid gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_countdown_promotion"
                checked={formData.is_countdown_promotion}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  is_countdown_promotion: checked as boolean,
                  promo_end_at: checked ? prev.promo_end_at : ''
                }))}
              />
              <Label htmlFor="is_countdown_promotion" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Aktifkan Countdown Promotion
              </Label>
            </div>
            
            {formData.is_countdown_promotion && (
              <div className="grid gap-2">
                <Label htmlFor="promo_end_at">Tanggal Berakhir Promo *</Label>
                <Input
                  id="promo_end_at"
                  type="datetime-local"
                  value={formData.promo_end_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, promo_end_at: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500">
                  Pilih tanggal dan waktu berakhirnya promo countdown
                </p>
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Tipe Produk</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Template">Template</SelectItem>
                <SelectItem value="Course">Course</SelectItem>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image_url">URL Gambar</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="boboy-kids (otomatis dibuat dari nama)"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingProduct ? 'Update' : 'Tambah'} Produk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main ProductList Component
const ProductList = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Queries
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Mutations
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Produk berhasil dihapus!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPromoActive = (product: Product) => {
    if (!product.is_countdown_promotion || !product.promo_end_at) return false;
    return new Date() < new Date(product.promo_end_at);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Memuat produk...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {(error as Error).message}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Daftar Produk</h1>
          <p className="text-gray-600 mt-2">Kelola semua produk digital Anda</p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada produk tersedia</p>
          <Button onClick={handleAddProduct} className="mt-4">
            Tambah Produk Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                {product.image_url && (
                  <div className="w-full h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">{product.type}</Badge>
                      {product.is_countdown_promotion && (
                        <Badge 
                          variant={isPromoActive(product) ? "default" : "outline"}
                          className="flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          {isPromoActive(product) ? "Promo Aktif" : "Promo Berakhir"}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">/{product.slug}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-sm line-clamp-3 mb-4">
                  {product.description}
                </CardDescription>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    {product.promo_price > 0 ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(product.promo_price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Countdown Promotion Info */}
                {product.is_countdown_promotion && product.promo_end_at && (
                  <div className="mb-4 p-2 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-800">
                      <strong>Promo berakhir:</strong> {formatDate(product.promo_end_at)}
                    </p>
                  </div>
                )}

                {/* Product Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {product.link_categories?.length || 0} Kategori
                  </span>
                  <span>
                    {product.link_categories?.reduce((total, cat) => total + (cat.links?.length || 0), 0) || 0} Link
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/admin/product/${product.id}`} className="flex-1">
                    <Button size="sm" variant="default" className="w-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Detail
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center gap-1"
                    disabled={deleteProductMutation.isPending}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    disabled={deleteProductMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default ProductList;