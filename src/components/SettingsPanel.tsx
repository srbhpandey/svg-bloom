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
import { Switch } from '@/components/ui/switch';
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('logoSharp')}
                disabled={disabled}
                className="text-xs"
              >
                Logo (Sharp)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('logoSmooth')}
                disabled={disabled}
                className="text-xs"
              >
                Logo (Smooth)
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
                onClick={() => applyPreset('detailed')}
                disabled={disabled}
                className="text-xs"
              >
                Detailed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('ultraCompact')}
                disabled={disabled}
                className="text-xs"
              >
                Ultra Compact
              </Button>
            </div>
          </div>

          {/* Posterize Level (Colors) */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Color Levels</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Number of color levels. Lower = smaller file size.
                      Use 2 for simple logos.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.posterizeLevel}
              </span>
            </div>
            <Slider
              value={[settings.posterizeLevel]}
              onValueChange={([value]) => updateSetting('posterizeLevel', value)}
              min={2}
              max={16}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>More colors</span>
            </div>
          </div>

          {/* Curve Smoothness */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Edge Smoothness</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Controls curve smoothness. Higher = smoother curves,
                      lower = sharper corners.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.alphamax.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[settings.alphamax * 10]}
              onValueChange={([value]) => updateSetting('alphamax', value / 10)}
              min={0}
              max={13}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Sharp corners</span>
              <span>Smooth curves</span>
            </div>
          </div>

          {/* Noise Removal */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Noise Removal</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Removes small artifacts. Higher values = cleaner output
                      but may lose fine details.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.turdsize}px
              </span>
            </div>
            <Slider
              value={[settings.turdsize]}
              onValueChange={([value]) => updateSetting('turdsize', value)}
              min={1}
              max={15}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Keep details</span>
              <span>Remove noise</span>
            </div>
          </div>

          {/* Curve Tolerance */}
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Curve Precision</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Curve optimization tolerance. Lower = more accurate curves,
                      higher = simpler paths.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.opttolerance.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[settings.opttolerance * 100]}
              onValueChange={([value]) => updateSetting('opttolerance', value / 100)}
              min={5}
              max={100}
              step={5}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>More accurate</span>
              <span>Smaller file</span>
            </div>
          </div>

          {/* Extract Colors Toggle */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Extract Colors</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Extract colors from the image. Turn off for black & white output.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                checked={settings.extractColors}
                onCheckedChange={(checked) => updateSetting('extractColors', checked)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsPanel;
