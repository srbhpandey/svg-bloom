import { Settings, Info, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VectorizerSettings, presets } from '@/lib/vectorizer-config';
import { useState } from 'react';

interface SettingsPanelProps {
  settings: VectorizerSettings;
  onSettingsChange: (settings: VectorizerSettings) => void;
  disabled?: boolean;
}

const SettingsPanel = ({
  settings,
  onSettingsChange,
  disabled,
}: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof VectorizerSettings>(
    key: K,
    value: VectorizerSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    onSettingsChange(presets[presetName]);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isOpen ? 'Hide Settings' : 'Vectorization Settings'}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="animate-slide-up">
        <div className="mt-4 p-6 rounded-xl border border-border bg-card">
          {/* Presets */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium">Quick Presets</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('detailed')}
                disabled={disabled}
                className="text-xs"
              >
                Detailed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('simplified')}
                disabled={disabled}
                className="text-xs"
              >
                Simplified
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('blackWhite')}
                disabled={disabled}
                className="text-xs"
              >
                Black & White
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('poster')}
                disabled={disabled}
                className="text-xs"
              >
                Poster
              </Button>
            </div>
          </div>

          {/* Color Mode */}
          <div className="pb-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Color Mode</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Choose how colors are processed in the vector output.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Select
              value={settings.mode}
              onValueChange={(value: 'color' | 'grayscale' | 'black-white') =>
                updateSetting('mode', value)
              }
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Full Color</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="black-white">Black & White</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Count Slider */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Colors</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Number of colors in the output. Fewer colors = smaller file,
                      more colors = more detail.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.colorCount}
              </span>
            </div>
            <Slider
              value={[settings.colorCount]}
              onValueChange={([value]) => updateSetting('colorCount', value)}
              min={2}
              max={64}
              step={1}
              disabled={disabled || settings.mode === 'black-white'}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Minimal</span>
              <span>Detailed</span>
            </div>
          </div>

          {/* Detail Level Slider */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Detail Level</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Minimum path size to include. Higher values remove small details.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.pathomit}px
              </span>
            </div>
            <Slider
              value={[settings.pathomit]}
              onValueChange={([value]) => updateSetting('pathomit', value)}
              min={1}
              max={32}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>More detail</span>
              <span>Less noise</span>
            </div>
          </div>

          {/* Smoothing Slider */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Smoothing</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Apply blur before tracing for smoother edges.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.blurRadius}
              </span>
            </div>
            <Slider
              value={[settings.blurRadius]}
              onValueChange={([value]) => updateSetting('blurRadius', value)}
              min={0}
              max={5}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Sharp edges</span>
              <span>Smooth curves</span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsPanel;
