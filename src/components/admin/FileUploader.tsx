import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  currentFile?: string;
  onRemove?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  currentFile,
  onRemove,
  className,
  children
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
      
      // Create preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  // Clear preview when currentFile changes or component unmounts
  React.useEffect(() => {
    setPreview(null);
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [currentFile]);

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    onRemove?.();
  };

  const displayImage = preview || currentFile;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Error messages */}
      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {fileRejections[0].errors.map((error) => (
            <div key={error.code}>
              {error.code === 'file-too-large' && `Arquivo muito grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`}
              {error.code === 'file-invalid-type' && 'Tipo de arquivo não suportado'}
            </div>
          ))}
        </div>
      )}
      
      {displayImage && (
        <div className="relative">
          {displayImage.includes('.mp4') || displayImage.includes('.webm') ? (
            <video
              src={displayImage}
              className="w-full h-48 object-cover rounded-lg"
              controls
            />
          ) : (
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                console.error('Error loading image:', displayImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {(onRemove || preview) && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              type="button"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          "hover:border-primary/50",
          fileRejections.length > 0 && "border-red-300"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
        {children || (
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? "Solte o arquivo aqui" : "Clique ou arraste um arquivo"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo {Math.round(maxSize / 1024 / 1024)}MB - PNG, JPG, JPEG, GIF, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};