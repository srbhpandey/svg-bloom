import { Download, ArrowRight, Check, RefreshCw, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompressionResult as CompressionResultType, formatFileSize } from '@/lib/svgo-config';

interface CompressionResultProps {
  result: CompressionResultType;
  fileName: string;
  onDownload: () => void;
  onReset: () => void;
}

const CompressionResult = ({
  result,
  fileName,
  onDownload,
  onReset,
}: CompressionResultProps) => {
  const getCompressedFileName = () => {
    const baseName = fileName.replace(/\.svg$/i, '');
    return `${baseName}-compressed.svg`;
  };

  return (
    <div className="w-full animate-scale-in">
      {/* Success Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Compression Complete!
        </h2>
        <p className="text-muted-foreground">
          Your SVG has been optimized and is ready to download
        </p>
      </div>

      {/* Size Comparison */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Original Size */}
          <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 min-w-[140px]">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Original
            </span>
            <span className="text-2xl font-bold text-foreground">
              {formatFileSize(result.originalSize)}
            </span>
          </div>

          <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
          <div className="w-6 h-6 flex items-center justify-center md:hidden">
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
          </div>

          {/* Compressed Size */}
          <div className="flex flex-col items-center p-4 rounded-xl bg-success/10 min-w-[140px]">
            <span className="text-xs font-medium text-success uppercase tracking-wider mb-1">
              Compressed
            </span>
            <span className="text-2xl font-bold text-success">
              {formatFileSize(result.compressedSize)}
            </span>
          </div>
        </div>

        {/* Savings Badge */}
        <div className="flex justify-center mt-6">
          <div className="success-badge text-base px-4 py-2">
            <span className="font-bold">{result.savedPercentage}%</span>
            <span className="ml-1">smaller</span>
            <span className="mx-2">•</span>
            <span>{formatFileSize(result.savedBytes)} saved</span>
          </div>
        </div>
      </div>

      {/* File Preview */}
      <div className="card-elevated p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <FileType className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {getCompressedFileName()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(result.compressedSize)} • SVG
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onDownload}
          className="btn-hero flex-1 gap-2"
          size="lg"
        >
          <Download className="w-5 h-5" />
          Download Compressed SVG
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Compress Another
        </Button>
      </div>
    </div>
  );
};

export default CompressionResult;
