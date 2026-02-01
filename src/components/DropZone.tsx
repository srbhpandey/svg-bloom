import { useCallback, useState } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.tif'];

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const DropZone = ({ onFileSelect, disabled }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      // Check file type
      const isValidType = ACCEPTED_TYPES.includes(file.type);
      const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isValidType && !hasValidExtension) {
        setError('Please upload an image file (PNG, JPG, WEBP, GIF, BMP, TIFF)');
        return false;
      }

      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError('File size must be less than 20MB');
        return false;
      }

      return true;
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0 && validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    },
    [disabled, validateFile, onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && validateFile(files[0])) {
        onFileSelect(files[0]);
      }
      // Reset input
      e.target.value = '';
    },
    [validateFile, onFileSelect]
  );

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'dropzone relative flex flex-col items-center justify-center p-12 md:p-16 cursor-pointer group',
          isDragging && 'dropzone-active',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div
          className={cn(
            'flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-200',
            isDragging
              ? 'bg-primary text-primary-foreground scale-110'
              : 'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'
          )}
        >
          {isDragging ? (
            <ImageIcon className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse from your computer
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP, GIF, BMP, TIFF • Max 20MB
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-slide-up">
          <X className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default DropZone;
