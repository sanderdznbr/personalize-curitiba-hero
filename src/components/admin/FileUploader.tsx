import React, { useCallback } from 'react';
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
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  return (
    <div className={cn("space-y-4", className)}>
      {currentFile && (
        <div className="relative">
          {currentFile.includes('.mp4') || currentFile.includes('.webm') ? (
            <video
              src={currentFile}
              className="w-full h-48 object-cover rounded-lg"
              controls
            />
          ) : (
            <img
              src={currentFile}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemove}
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
          "hover:border-primary/50"
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
              Máximo {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};