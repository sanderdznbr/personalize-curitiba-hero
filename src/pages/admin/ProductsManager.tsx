import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUploader } from '@/components/admin/FileUploader';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  order_index: number;
  active: boolean;
}

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      console.log('Uploading product image:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('products-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Erro no upload",
          description: uploadError.message || "Erro ao fazer upload da imagem",
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('products-images')
        .getPublicUrl(fileName);

      console.log('Upload successful, URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload catch error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado no upload da imagem",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do produto é obrigatório",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = editingProduct?.image_url || null;

    if (uploadedFile) {
      console.log('Uploading new file:', uploadedFile.name);
      imageUrl = await uploadImage(uploadedFile);
      if (!imageUrl) return;
    }

    const productData = {
      name: formData.name,
      image_url: imageUrl,
      order_index: editingProduct ? editingProduct.order_index : products.length,
      active: true,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('product_categories')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar produto",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from('product_categories')
        .insert(productData);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar produto",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Sucesso",
      description: editingProduct ? "Produto atualizado!" : "Produto criado!",
    });

    setIsDialogOpen(false);
    resetForm();
    fetchProducts();
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('product_categories')
      .update({ active: !product.active })
      .eq('id', product.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    } else {
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar produto",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Produto deletado!",
      });
      fetchProducts();
    }
  };

  const updateOrder = async (productId: string, newOrder: number) => {
    const { error } = await supabase
      .from('product_categories')
      .update({ order_index: newOrder })
      .eq('id', productId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem",
        variant: "destructive",
      });
    } else {
      fetchProducts();
    }
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;

    const product = products[index];
    const targetProduct = products[newIndex];

    updateOrder(product.id, targetProduct.order_index);
    updateOrder(targetProduct.id, product.order_index);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
    });
    setUploadedFile(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
            <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Camisas Polo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <FileUploader
                    onFileSelect={setUploadedFile}
                    currentFile={editingProduct?.image_url || undefined}
                    onRemove={() => setUploadedFile(null)}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className={!product.active ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-3">{product.name}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(product)}
                  >
                    {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveProduct(index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveProduct(index, 'down')}
                    disabled={index === products.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};