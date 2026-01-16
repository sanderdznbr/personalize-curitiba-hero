import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TripleImageUploaderProps {
  webImageUrl?: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
  onWebImageChange: (url: string | null) => void;
  onTabletImageChange: (url: string | null) => void;
  onMobileImageChange: (url: string | null) => void;
  bucketName: string;
  disabled?: boolean;
}

interface ImageDropzoneProps {
  imageUrl?: string;
  onImageChange: (url: string | null) => void;
  type: 'web' | 'tablet' | 'mobile';
  bucketName: string;
  disabled?: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  imageUrl,
  onImageChange,
  type,
  bucketName,
  disabled = false,
  title,
  subtitle,
  icon,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
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
        description: `Imagem ${title.toLowerCase()} enviada com sucesso`,
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: disabled || uploading,
  });

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground font-medium text-primary">
          {subtitle}
        </p>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors min-h-[140px] flex flex-col items-center justify-center ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          {imageUrl ? (
            <div className="relative w-full">
              <img
                src={imageUrl}
                alt={`Preview ${type}`}
                className="w-full h-24 object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(null);
                }}
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mb-1 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {isDragActive ? 'Solte aqui' : 'Clique ou arraste'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TripleImageUploader: React.FC<TripleImageUploaderProps> = ({
  webImageUrl,
  tabletImageUrl,
  mobileImageUrl,
  onWebImageChange,
  onTabletImageChange,
  onMobileImageChange,
  bucketName,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ImageDropzone
        imageUrl={webImageUrl}
        onImageChange={onWebImageChange}
        type="web"
        bucketName={bucketName}
        disabled={disabled}
        title="Desktop"
        subtitle="1920 x 600 px"
        icon={<Monitor className="w-4 h-4" />}
      />
      
      <ImageDropzone
        imageUrl={tabletImageUrl}
        onImageChange={onTabletImageChange}
        type="tablet"
        bucketName={bucketName}
        disabled={disabled}
        title="Tablet"
        subtitle="1024 x 500 px"
        icon={<Tablet className="w-4 h-4" />}
      />
      
      <ImageDropzone
        imageUrl={mobileImageUrl}
        onImageChange={onMobileImageChange}
        type="mobile"
        bucketName={bucketName}
        disabled={disabled}
        title="Mobile"
        subtitle="720 x 800 px"
        icon={<Smartphone className="w-4 h-4" />}
      />
    </div>
  );
};
