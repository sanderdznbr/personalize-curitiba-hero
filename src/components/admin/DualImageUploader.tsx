import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DualImageUploaderProps {
  webImageUrl?: string;
  mobileImageUrl?: string;
  onWebImageChange: (url: string | null) => void;
  onMobileImageChange: (url: string | null) => void;
  bucketName: string;
  disabled?: boolean;
}

export const DualImageUploader: React.FC<DualImageUploaderProps> = ({
  webImageUrl,
  mobileImageUrl,
  onWebImageChange,
  onMobileImageChange,
  bucketName,
  disabled = false,
}) => {
  const [webUploading, setWebUploading] = useState(false);
  const [mobileUploading, setMobileUploading] = useState(false);

  const uploadFile = async (file: File, type: 'web' | 'mobile') => {
    const setUploading = type === 'web' ? setWebUploading : setMobileUploading;
    const onImageChange = type === 'web' ? onWebImageChange : onMobileImageChange;
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      onImageChange(data.publicUrl);

      toast({
        title: "Upload realizado!",
        description: `Imagem ${type === 'web' ? 'web' : 'mobile'} enviada com sucesso`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar arquivo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const WebDropzone = useCallback(() => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          uploadFile(acceptedFiles[0], 'web');
        }
      },
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      },
      multiple: false,
      disabled: disabled || webUploading,
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${disabled || webUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {webImageUrl ? (
          <div className="relative w-full">
            <img
              src={webImageUrl}
              alt="Preview web"
              className="w-full h-32 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onWebImageChange(null);
              }}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            {webUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste a imagem web'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }, [webImageUrl, webUploading, disabled, onWebImageChange]);

  const MobileDropzone = useCallback(() => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          uploadFile(acceptedFiles[0], 'mobile');
        }
      },
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      },
      multiple: false,
      disabled: disabled || mobileUploading,
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors min-h-[200px] flex flex-col items-center justify-center ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${disabled || mobileUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {mobileImageUrl ? (
          <div className="relative w-full">
            <img
              src={mobileImageUrl}
              alt="Preview mobile"
              className="w-full h-32 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onMobileImageChange(null);
              }}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            {mobileUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste a imagem mobile'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  }, [mobileImageUrl, mobileUploading, disabled, onMobileImageChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem Web
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recomendado: 1920x600px (desktop/tablet)
          </p>
        </CardHeader>
        <CardContent>
          <WebDropzone />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem Mobile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recomendado: 720x400px (smartphones)
          </p>
        </CardHeader>
        <CardContent>
          <MobileDropzone />
        </CardContent>
      </Card>
    </div>
  );
};