import { Download, ArrowRight, Check, RefreshCw, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VectorizationResult, formatFileSize } from '@/lib/vectorizer-config';

interface CompressionResultProps {
  result: VectorizationResult;
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
  const getOutputFileName = () => {
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    return `${baseName}-vector.svg`;
  };

  return (
    <div className="w-full animate-scale-in">
      {/* Success Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Vectorization Complete!
        </h2>
        <p className="text-muted-foreground text-center">
          Your image has been converted to scalable vector SVG
        </p>
      </div>

      {/* SVG Preview */}
      <div className="card-elevated p-4 mb-6 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IGZpbGw9IiNmNWY1ZjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IGZpbGw9IiNlNWU1ZTUiIHg9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZTVlNWU1IiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgZmlsbD0iI2Y1ZjVmNSIgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY2hlY2tlcnMpIi8+PC9zdmc+')] rounded-xl overflow-hidden">
        <div
          className="max-w-full max-h-64"
          dangerouslySetInnerHTML={{ __html: result.svgContent }}
        />
      </div>

      {/* Size Info */}
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
            <span className="text-xs text-muted-foreground mt-1">
              {result.originalWidth} × {result.originalHeight}
            </span>
          </div>

          <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
          <div className="w-6 h-6 flex items-center justify-center md:hidden">
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
          </div>

          {/* SVG Size */}
          <div className="flex flex-col items-center p-4 rounded-xl bg-primary/10 min-w-[140px]">
            <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
              Vector SVG
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatFileSize(result.svgSize)}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Scalable
            </span>
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
              {getOutputFileName()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(result.svgSize)} • Vector SVG
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
          Download SVG
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Convert Another
        </Button>
      </div>
    </div>
  );
};

export default CompressionResult;
