import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DualImageUploader } from '@/components/admin/DualImageUploader';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  image_mobile_url: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  active: boolean;
}

export const BannersManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    image_mobile_url: '',
    button_text: '',
    button_link: '',
    active: true,
    order_index: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            image_mobile_url: formData.image_mobile_url,
            button_text: formData.button_text,
            button_link: formData.button_link,
            active: formData.active,
            order_index: formData.order_index,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Banner atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([{
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            image_mobile_url: formData.image_mobile_url,
            button_text: formData.button_text,
            button_link: formData.button_link,
            active: formData.active,
            order_index: formData.order_index,
          }]);

        if (error) throw error;
        toast({ title: "Banner criado com sucesso!" });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao salvar banner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      image_mobile_url: '',
      button_text: '',
      button_link: '',
      active: true,
      order_index: 0,
    });
  };

  const editBanner = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      image_mobile_url: banner.image_mobile_url || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      active: banner.active,
      order_index: banner.order_index,
    });
    setIsDialogOpen(true);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Banner deletado com sucesso!" });
      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao deletar banner",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ active: !banner.active })
        .eq('id', banner.id);

      if (error) throw error;
      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
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
            <p className="text-muted-foreground">Gerencie os banners da página inicial com formatos web e mobile</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Banner' : 'Novo Banner'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título principal do banner"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Subtítulo (opcional)"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Texto do Botão</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Texto do botão (opcional)"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_link">Link do Botão</Label>
                    <Input
                      id="button_link"
                      value={formData.button_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                      placeholder="URL do link (opcional)"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <DualImageUploader
                    webImageUrl={formData.image_url}
                    mobileImageUrl={formData.image_mobile_url}
                    onWebImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url || '' }))}
                    onMobileImageChange={(url) => setFormData(prev => ({ ...prev, image_mobile_url: url || '' }))}
                    bucketName="banners-images"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="active">Banner ativo</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'} Banner
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Imagens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum banner encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{banner.title}</div>
                          {banner.subtitle && (
                            <div className="text-sm text-muted-foreground">{banner.subtitle}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {banner.image_url && (
                            <img src={banner.image_url} alt="Web" className="w-12 h-8 object-cover rounded" />
                          )}
                          {banner.image_mobile_url && (
                            <img src={banner.image_mobile_url} alt="Mobile" className="w-8 h-8 object-cover rounded" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={banner.active}
                            onCheckedChange={() => toggleActive(banner)}
                          />
                          <span className="text-sm">
                            {banner.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{banner.order_index}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editBanner(banner)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBanner(banner.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};