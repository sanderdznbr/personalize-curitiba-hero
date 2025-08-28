import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUploader } from '@/components/admin/FileUploader';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  active: boolean;
}

export const BannersManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('order_index');

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar banners",
        variant: "destructive",
      });
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      console.log('Uploading banner image:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('banners-images')
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
        .from('banners-images')
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
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = editingBanner?.image_url || null;

    if (uploadedFile) {
      console.log('Uploading new file:', uploadedFile.name);
      imageUrl = await uploadImage(uploadedFile);
      if (!imageUrl) return;
    }

    const bannerData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      image_url: imageUrl,
      button_text: formData.button_text || null,
      button_link: formData.button_link || null,
      order_index: editingBanner ? editingBanner.order_index : banners.length,
      active: true,
    };

    if (editingBanner) {
      const { error } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', editingBanner.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar banner",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from('banners')
        .insert(bannerData);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar banner",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Sucesso",
      description: editingBanner ? "Banner atualizado!" : "Banner criado!",
    });

    setIsDialogOpen(false);
    resetForm();
    fetchBanners();
  };

  const toggleActive = async (banner: Banner) => {
    const { error } = await supabase
      .from('banners')
      .update({ active: !banner.active })
      .eq('id', banner.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    } else {
      fetchBanners();
    }
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar banner",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Banner deletado!",
      });
      fetchBanners();
    }
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
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
            <h1 className="text-3xl font-bold">Gerenciar Banners</h1>
            <p className="text-muted-foreground">Gerencie o slider da página inicial</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título principal do banner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Subtítulo (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_text">Texto do Botão</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Texto do botão (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_link">Link do Botão</Label>
                  <Input
                    id="button_link"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="URL do link (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem de Fundo</Label>
                  <FileUploader
                    onFileSelect={setUploadedFile}
                    currentFile={editingBanner?.image_url || undefined}
                    onRemove={() => setUploadedFile(null)}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingBanner ? 'Atualizar' : 'Criar'} Banner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className={!banner.active ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
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
                <CardTitle className="text-lg mb-2">{banner.title}</CardTitle>
                {banner.subtitle && (
                  <p className="text-sm text-muted-foreground mb-3">{banner.subtitle}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(banner)}
                  >
                    {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBanner(banner.id)}
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