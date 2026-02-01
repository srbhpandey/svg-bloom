import { useCallback, useState } from 'react';
import { Upload, FileType, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileSelect: (file: File, content: string) => void;
  disabled?: boolean;
}

const DropZone = ({ onFileSelect, disabled }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndReadFile = useCallback(
    async (file: File) => {
      setError(null);

      // Check file type
      if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
        setError('Please upload an SVG file');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      try {
        const content = await file.text();
        
        // Basic SVG validation
        if (!content.includes('<svg') || !content.includes('</svg>')) {
          setError('Invalid SVG file');
          return;
        }

        onFileSelect(file, content);
      } catch (err) {
        setError('Failed to read file');
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndReadFile(files[0]);
      }
    },
    [disabled, validateAndReadFile]
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
      if (files && files.length > 0) {
        validateAndReadFile(files[0]);
      }
      // Reset input
      e.target.value = '';
    },
    [validateAndReadFile]
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
          accept=".svg,image/svg+xml"
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
            <FileType className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragging ? 'Drop your SVG here' : 'Drag & drop your SVG'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse from your computer
        </p>
        <p className="text-xs text-muted-foreground">
          Supports .svg files up to 10MB
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
