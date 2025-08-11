import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, FolderPlus, ExternalLink, PlusIcon, Loader2 } from 'lucide-react';
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
const fetchProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      link_categories(
        *,
        links(*)
      )
    `)
    .eq('id', id)
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

const createCategory = async (categoryData: Omit<LinkCategory, 'id' | 'links'>): Promise<LinkCategory> => {
  const { data, error } = await supabase
    .from('link_categories')
    .insert([categoryData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updateCategory = async (id: string, categoryData: Partial<LinkCategory>): Promise<LinkCategory> => {
  const { data, error } = await supabase
    .from('link_categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('link_categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

const createLink = async (linkData: Omit<Link, 'id'>): Promise<Link> => {
  const { data, error } = await supabase
    .from('links')
    .insert([linkData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updateLink = async (id: string, linkData: Partial<Link>): Promise<Link> => {
  const { data, error } = await supabase
    .from('links')
    .update(linkData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('links')
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
    slug: ''
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
        slug: editingProduct.slug
      });
    }
  }, [editingProduct, isOpen]);

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({ title: 'Produk berhasil diupdate!' });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.price || !editingProduct) {
      toast({ title: 'Error', description: 'Mohon lengkapi field yang wajib diisi', variant: 'destructive' });
      return;
    }

    const productData = {
      ...formData,
      price: parseInt(formData.price) || 0,
      promo_price: parseInt(formData.promo_price) || 0,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
    };

    updateProductMutation.mutate({ id: editingProduct.id, data: productData });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>Ubah informasi produk</DialogDescription>
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
          <Button onClick={handleSubmit} disabled={updateProductMutation.isPending}>
            {updateProductMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Produk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Category Form Dialog Component
const CategoryFormDialog = ({ 
  isOpen, 
  onClose, 
  productId, 
  editingCategory,
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  productId: string;
  editingCategory: LinkCategory | null;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: '1'
  });

  React.useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description,
        order: editingCategory.order?.toString() || '1'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        order: '1'
      });
    }
  }, [editingCategory, isOpen]);

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({ title: 'Kategori berhasil ditambahkan!' });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LinkCategory> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({ title: 'Kategori berhasil diupdate!' });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !productId) {
      toast({ title: 'Error', description: 'Mohon lengkapi semua field kategori', variant: 'destructive' });
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      order: parseInt(formData.order) || 1,
      product_id: productId
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Ubah informasi kategori' : 'Isi informasi kategori baru'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Nama Kategori *</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama kategori"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category-description">Deskripsi *</Label>
            <Textarea
              id="category-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Masukkan deskripsi kategori"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category-order">Urutan</Label>
            <Input
              id="category-order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              placeholder="1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingCategory ? 'Update' : 'Tambah'} Kategori
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Link Form Dialog Component
const LinkFormDialog = ({ 
  isOpen, 
  onClose, 
  categoryId, 
  editingLink,
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  categoryId: string | null;
  editingLink: Link | null;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    order: '1'
  });

  React.useEffect(() => {
    if (editingLink) {
      setFormData({
        name: editingLink.name,
        url: editingLink.url,
        description: editingLink.description || '',
        order: editingLink.order?.toString() || '1'
      });
    } else {
      setFormData({
        name: '',
        url: '',
        description: '',
        order: '1'
      });
    }
  }, [editingLink, isOpen]);

  const createLinkMutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({ title: 'Link berhasil ditambahkan!' });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Link> }) => updateLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast({ title: 'Link berhasil diupdate!' });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.url || !categoryId) {
      toast({ title: 'Error', description: 'Mohon lengkapi semua field link', variant: 'destructive' });
      return;
    }

    const linkData = {
      name: formData.name,
      url: formData.url,
      description: formData.description,
      order: parseInt(formData.order) || 1,
      category_id: categoryId
    };

    if (editingLink) {
      updateLinkMutation.mutate({ id: editingLink.id, data: linkData });
    } else {
      createLinkMutation.mutate(linkData);
    }
  };

  const isLoading = createLinkMutation.isPending || updateLinkMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editingLink ? 'Edit Link' : 'Tambah Link Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingLink ? 'Ubah informasi link' : 'Isi informasi link baru'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link-name">Nama Link *</Label>
            <Input
              id="link-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama link"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="link-url">URL *</Label>
            <Input
              id="link-url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="link-description">Deskripsi</Label>
            <Textarea
              id="link-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Masukkan deskripsi link"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="link-order">Urutan</Label>
            <Input
              id="link-order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              placeholder="1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingLink ? 'Update' : 'Tambah'} Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main ProductDetail Component
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState<LinkCategory | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Queries
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  // Mutations
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast({ title: 'Produk berhasil dihapus!' });
      navigate('/products');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({ title: 'Kategori berhasil dihapus!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({ title: 'Link berhasil dihapus!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleDeleteProduct = () => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProductMutation.mutate(id!);
    }
  };

  const handleEditCategory = (category: LinkCategory) => {
    setEditingCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const handleEditLink = (link: Link, categoryId: string) => {
    setEditingLink(link);
    setSelectedCategoryId(categoryId);
    setIsLinkDialogOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
      deleteLinkMutation.mutate(linkId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
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
          <Button onClick={() => navigate('/products')}>
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
          <Button onClick={() => navigate('/products')}>
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Product Header */}
      <Card className="mb-6">
        <CardHeader>
          {product.image_url && (
            <div className="w-full h-60 bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{product.type}</Badge>
                <span className="text-sm text-gray-500">/{product.slug}</span>
              </div>
              <CardDescription className="text-base">
                {product.description}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              {product.promo_price > 0 ? (
                <>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(product.promo_price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsProductDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Produk
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteProduct}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                disabled={deleteProductMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Produk
              </Button>
              <Button
                onClick={() => setIsCategoryDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                Tambah Kategori
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Categories and Links */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Kategori & Link</h2>
          <div className="text-sm text-gray-500">
            {product.link_categories?.length || 0} Kategori, {' '}
            {product.link_categories?.reduce((total, cat) => total + (cat.links?.length || 0), 0) || 0} Link
          </div>
        </div>

        {product.link_categories && product.link_categories.length > 0 ? (
          <div className="space-y-4">
            {product.link_categories.sort((a, b) => a.order - b.order).map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {category.order}
                      </span>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setIsLinkDialogOpen(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <PlusIcon className="w-3 h-3" />
                        Tambah Link
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {category.links && category.links.length > 0 ? (
                    <div className="space-y-2">
                      {category.links.sort((a, b) => (a.order || 1) - (b.order || 1)).map((link) => (
                        <div key={link.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="bg-blue-600 text-white px-2 py-1 text-sm rounded font-medium">
                              {link.order || 1}
                            </span>
                            <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium block truncate"
                                title={link.name}
                              >
                                {link.name}
                              </a>
                              {link.description && (
                                <p className="text-sm text-gray-500 truncate">{link.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditLink(link, category.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteLink(link.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              disabled={deleteLinkMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-3">Belum ada link dalam kategori ini</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setIsLinkDialogOpen(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <PlusIcon className="w-3 h-3" />
                        Tambah Link Pertama
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Belum ada kategori untuk produk ini</p>
              <Button
                onClick={() => setIsCategoryDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                Tambah Kategori Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        isOpen={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        editingProduct={product}
      />

      <CategoryFormDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        productId={id!}
        editingCategory={editingCategory}
        onSuccess={() => {
          setEditingCategory(null);
          setIsCategoryDialogOpen(false);
        }}
      />

      <LinkFormDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        categoryId={selectedCategoryId}
        editingLink={editingLink}
        onSuccess={() => {
          setEditingLink(null);
          setSelectedCategoryId(null);
          setIsLinkDialogOpen(false);
        }}
      />
    </div>
  );
};

export default ProductDetail;