import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  fileName: string;
}

const ProcessingState = ({ fileName }: ProcessingStateProps) => {
  return (
    <div className="w-full flex flex-col items-center py-12 animate-scale-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse-subtle" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        Compressing your SVG...
      </h3>
      <p className="text-sm text-muted-foreground mb-6">{fileName}</p>

      <div className="w-full max-w-xs">
        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill animate-pulse"
            style={{ width: '70%' }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Optimizing paths, removing metadata, and minifying...
        </p>
      </div>
    </div>
  );
};

export default ProcessingState;
