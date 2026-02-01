import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import DropZone from '@/components/DropZone';
import SettingsPanel from '@/components/SettingsPanel';
import ProcessingState from '@/components/ProcessingState';
import CompressionResult from '@/components/CompressionResult';
import FeatureCards from '@/components/FeatureCards';
import { useToast } from '@/hooks/use-toast';
import {
  CompressionSettings,
  CompressionResult as CompressionResultType,
  defaultSettings,
  compressSVG,
} from '@/lib/svgo-config';

type AppState = 'idle' | 'processing' | 'complete';

const Index = () => {
  const [state, setState] = useState<AppState>('idle');
  const [settings, setSettings] = useState<CompressionSettings>(defaultSettings);
  const [fileName, setFileName] = useState<string>('');
  const [result, setResult] = useState<CompressionResultType | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(
    async (file: File, content: string) => {
      setFileName(file.name);
      setState('processing');

      try {
        // Small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const compressionResult = await compressSVG(content, settings);
        setResult(compressionResult);
        setState('complete');

        toast({
          title: 'Compression Complete!',
          description: `Saved ${compressionResult.savedPercentage}% (${formatBytes(compressionResult.savedBytes)})`,
        });
      } catch (error) {
        console.error('Compression failed:', error);
        setState('idle');
        toast({
          variant: 'destructive',
          title: 'Compression Failed',
          description: 'There was an error processing your SVG. Please try again.',
        });
      }
    },
    [settings, toast]
  );

  const handleDownload = useCallback(() => {
    if (!result) return;

    const blob = new Blob([result.compressedContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.svg$/i, '') + '-compressed.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Your compressed SVG is downloading.',
    });
  }, [result, fileName, toast]);

  const handleReset = useCallback(() => {
    setState('idle');
    setResult(null);
    setFileName('');
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Compress SVG Files
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Reduce SVG file size while maintaining visual quality. Fast,
              private, and entirely in your browser.
            </p>
          </div>

          {/* Main Workspace Card */}
          <div className="card-elevated p-6 md:p-8 mb-8">
            {state === 'idle' && (
              <>
                <DropZone onFileSelect={handleFileSelect} />
                <div className="mt-6">
                  <SettingsPanel
                    settings={settings}
                    onSettingsChange={setSettings}
                  />
                </div>
              </>
            )}

            {state === 'processing' && <ProcessingState fileName={fileName} />}

            {state === 'complete' && result && (
              <CompressionResult
                result={result}
                fileName={fileName}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Feature Cards */}
          {state === 'idle' && <FeatureCards />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Built with ❤️ for designers and developers
        </p>
      </footer>
    </div>
  );
};

export default Index;
