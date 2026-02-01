import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import DropZone from '@/components/DropZone';
import SettingsPanel from '@/components/SettingsPanel';
import ProcessingState from '@/components/ProcessingState';
import CompressionResult from '@/components/CompressionResult';
import FeatureCards from '@/components/FeatureCards';
import { useToast } from '@/hooks/use-toast';
import {
  VectorizerSettings,
  VectorizationResult,
  defaultSettings,
  vectorizeImage,
  loadImageToCanvas,
} from '@/lib/vectorizer-config';

type AppState = 'idle' | 'processing' | 'complete';

const Index = () => {
  const [state, setState] = useState<AppState>('idle');
  const [settings, setSettings] = useState<VectorizerSettings>(defaultSettings);
  const [fileName, setFileName] = useState<string>('');
  const [result, setResult] = useState<VectorizationResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setState('processing');

      try {
        const { imageData } = await loadImageToCanvas(file);
        const vectorResult = await vectorizeImage(imageData, settings, file.size);
        
        setResult(vectorResult);
        setState('complete');

        toast({
          title: 'Vectorization Complete!',
          description: `Created ${formatBytes(vectorResult.svgSize)} vector SVG`,
        });
      } catch (error) {
        console.error('Vectorization failed:', error);
        setState('idle');
        toast({
          variant: 'destructive',
          title: 'Vectorization Failed',
          description: 'There was an error processing your image. Please try again.',
        });
      }
    },
    [settings, toast]
  );

  const handleDownload = useCallback(() => {
    if (!result) return;

    const blob = new Blob([result.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + '-vector.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Your vector SVG is downloading.',
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
              Convert Images to SVG
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Transform raster images into scalable vector graphics. Fast,
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
