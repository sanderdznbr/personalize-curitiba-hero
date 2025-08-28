import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/admin/FileUploader';
import { Save, Monitor, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AboutContent {
  id: string;
  title: string;
  description1: string | null;
  description2: string | null;
  video_web_url: string | null;
  video_mobile_url: string | null;
  button_text: string | null;
}

export const AboutManager: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description1: '',
    description2: '',
    button_text: '',
  });
  const [webVideoFile, setWebVideoFile] = useState<File | null>(null);
  const [mobileVideoFile, setMobileVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo",
        variant: "destructive",
      });
    } else if (data) {
      setContent(data);
      setFormData({
        title: data.title,
        description1: data.description1 || '',
        description2: data.description2 || '',
        button_text: data.button_text || '',
      });
    }
    setLoading(false);
  };

  const uploadVideo = async (file: File, type: 'web' | 'mobile'): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `about-video-${type}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('about-videos')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Erro",
        description: `Erro ao fazer upload do vídeo ${type}`,
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage
      .from('about-videos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);

    let webVideoUrl = content?.video_web_url || null;
    let mobileVideoUrl = content?.video_mobile_url || null;

    if (webVideoFile) {
      webVideoUrl = await uploadVideo(webVideoFile, 'web');
      if (!webVideoUrl) {
        setSaving(false);
        return;
      }
    }

    if (mobileVideoFile) {
      mobileVideoUrl = await uploadVideo(mobileVideoFile, 'mobile');
      if (!mobileVideoUrl) {
        setSaving(false);
        return;
      }
    }

    const updateData = {
      title: formData.title,
      description1: formData.description1 || null,
      description2: formData.description2 || null,
      video_web_url: webVideoUrl,
      video_mobile_url: mobileVideoUrl,
      button_text: formData.button_text || null,
    };

    const { error } = content
      ? await supabase
          .from('about_content')
          .update(updateData)
          .eq('id', content.id)
      : await supabase
          .from('about_content')
          .insert(updateData);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar conteúdo",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Conteúdo salvo com sucesso!",
      });
      fetchContent();
      setWebVideoFile(null);
      setMobileVideoFile(null);
    }

    setSaving(false);
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
            <h1 className="text-3xl font-bold">Gerenciar Seção Sobre</h1>
            <p className="text-muted-foreground">Edite o conteúdo da seção "Sobre a Personalize"</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo de Texto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título da seção"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description1">Primeira Descrição</Label>
                <Textarea
                  id="description1"
                  value={formData.description1}
                  onChange={(e) => setFormData({ ...formData, description1: e.target.value })}
                  placeholder="Primeiro parágrafo da descrição"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description2">Segunda Descrição</Label>
                <Textarea
                  id="description2"
                  value={formData.description2}
                  onChange={(e) => setFormData({ ...formData, description2: e.target.value })}
                  placeholder="Segundo parágrafo da descrição"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="button_text">Texto do Botão</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Texto do botão"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Vídeo para Web (Desktop)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFileSelect={setWebVideoFile}
                  currentFile={content?.video_web_url || undefined}
                  accept={{ 'video/*': ['.mp4', '.webm', '.mov'] }}
                  maxSize={50 * 1024 * 1024} // 50MB
                >
                  <div>
                    <p className="text-sm font-medium">
                      Clique ou arraste um vídeo para web
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formato horizontal recomendado • Máximo 50MB
                    </p>
                  </div>
                </FileUploader>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Vídeo para Mobile (Vertical)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFileSelect={setMobileVideoFile}
                  currentFile={content?.video_mobile_url || undefined}
                  accept={{ 'video/*': ['.mp4', '.webm', '.mov'] }}
                  maxSize={50 * 1024 * 1024} // 50MB
                >
                  <div>
                    <p className="text-sm font-medium">
                      Clique ou arraste um vídeo para mobile
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formato vertical recomendado • Máximo 50MB
                    </p>
                  </div>
                </FileUploader>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};