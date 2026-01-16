import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TripleImageUploader } from '@/components/admin/TripleImageUploader';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  image_tablet_url: string | null;
  image_mobile_url: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  active: boolean;
  overlay_color: string | null;
  overlay_opacity: number | null;
  image_fit: string | null;
  slide_duration: number | null;
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
    image_tablet_url: '',
    image_mobile_url: '',
    button_text: '',
    button_link: '',
    active: true,
    order_index: 0,
    overlay_color: '#00C563',
    overlay_opacity: 1,
    image_fit: 'cover',
    slide_duration: 5000,
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
            image_tablet_url: formData.image_tablet_url,
            image_mobile_url: formData.image_mobile_url,
            button_text: formData.button_text,
            button_link: formData.button_link,
            active: formData.active,
            order_index: formData.order_index,
            overlay_color: formData.overlay_color,
            overlay_opacity: formData.overlay_opacity,
            image_fit: formData.image_fit,
            slide_duration: formData.slide_duration,
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
            image_tablet_url: formData.image_tablet_url,
            image_mobile_url: formData.image_mobile_url,
            button_text: formData.button_text,
            button_link: formData.button_link,
            active: formData.active,
            order_index: formData.order_index,
            overlay_color: formData.overlay_color,
            overlay_opacity: formData.overlay_opacity,
            image_fit: formData.image_fit,
            slide_duration: formData.slide_duration,
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
      image_tablet_url: '',
      image_mobile_url: '',
      button_text: '',
      button_link: '',
      active: true,
      order_index: 0,
      overlay_color: '#00C563',
      overlay_opacity: 1,
      image_fit: 'cover',
      slide_duration: 5000,
    });
  };

  const editBanner = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      image_tablet_url: banner.image_tablet_url || '',
      image_mobile_url: banner.image_mobile_url || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      active: banner.active,
      order_index: banner.order_index,
      overlay_color: banner.overlay_color || '#00C563',
      overlay_opacity: banner.overlay_opacity ?? 1,
      image_fit: banner.image_fit || 'cover',
      slide_duration: banner.slide_duration ?? 5000,
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
                  <TripleImageUploader
                    webImageUrl={formData.image_url}
                    tabletImageUrl={formData.image_tablet_url}
                    mobileImageUrl={formData.image_mobile_url}
                    onWebImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url || '' }))}
                    onTabletImageChange={(url) => setFormData(prev => ({ ...prev, image_tablet_url: url || '' }))}
                    onMobileImageChange={(url) => setFormData(prev => ({ ...prev, image_mobile_url: url || '' }))}
                    bucketName="banners-images"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Configurações Visuais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configurações Visuais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="overlay_color">Cor de Fundo/Overlay</Label>
                        <div className="flex gap-2">
                          <Input
                            id="overlay_color"
                            type="color"
                            value={formData.overlay_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, overlay_color: e.target.value }))}
                            className="w-16 h-10 p-1 cursor-pointer"
                            disabled={isSubmitting}
                          />
                          <Input
                            value={formData.overlay_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, overlay_color: e.target.value }))}
                            placeholder="#00C563"
                            className="flex-1"
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Deixe transparente ou sem cor para remover o verde
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Opacidade do Overlay: {Math.round(formData.overlay_opacity * 100)}%</Label>
                        <Slider
                          value={[formData.overlay_opacity]}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, overlay_opacity: value[0] }))}
                          min={0}
                          max={1}
                          step={0.05}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                          0% = sem overlay, 100% = cor sólida
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image_fit">Modo de Exibição da Imagem</Label>
                        <Select
                          value={formData.image_fit}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, image_fit: value }))}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">Esticada (Cover) - Preenche todo espaço</SelectItem>
                            <SelectItem value="contain">Proporcional (Contain) - Mostra toda imagem</SelectItem>
                            <SelectItem value="fill">Distorcida (Fill) - Estica para preencher</SelectItem>
                            <SelectItem value="none">Original (None) - Tamanho real</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slide_duration">Tempo de Transição (segundos)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="slide_duration"
                            type="number"
                            min={1}
                            max={30}
                            value={formData.slide_duration / 1000}
                            onChange={(e) => setFormData(prev => ({ ...prev, slide_duration: Number(e.target.value) * 1000 }))}
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-muted-foreground">seg</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tempo até mudar para o próximo banner
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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