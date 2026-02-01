import { Settings, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { CompressionSettings } from '@/lib/svgo-config';
import { useState } from 'react';

interface SettingsPanelProps {
  settings: CompressionSettings;
  onSettingsChange: (settings: CompressionSettings) => void;
  disabled?: boolean;
}

const SettingsPanel = ({
  settings,
  onSettingsChange,
  disabled,
}: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof CompressionSettings>(
    key: K,
    value: CompressionSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const SettingRow = ({
    label,
    tooltip,
    children,
  }: {
    label: string;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {children}
    </div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Settings className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isOpen ? 'Hide Settings' : 'Compression Settings'}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="animate-slide-up">
        <div className="mt-4 p-6 rounded-xl border border-border bg-card">
          {/* Precision Slider */}
          <div className="pb-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Precision</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      Number of decimal places for coordinates. Lower = smaller
                      file, higher = more precision.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-primary">
                {settings.precision}
              </span>
            </div>
            <Slider
              value={[settings.precision]}
              onValueChange={([value]) => updateSetting('precision', value)}
              min={0}
              max={5}
              step={1}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>

          {/* Boolean Settings */}
          <div className="pt-2">
            <SettingRow
              label="Multipass"
              tooltip="Run optimization multiple times for better results"
            >
              <Switch
                checked={settings.multipass}
                onCheckedChange={(checked) =>
                  updateSetting('multipass', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Remove Comments"
              tooltip="Remove XML comments from the SVG"
            >
              <Switch
                checked={settings.removeComments}
                onCheckedChange={(checked) =>
                  updateSetting('removeComments', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Remove Metadata"
              tooltip="Remove editor metadata (Illustrator, Inkscape, etc.)"
            >
              <Switch
                checked={settings.removeMetadata}
                onCheckedChange={(checked) =>
                  updateSetting('removeMetadata', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Cleanup IDs"
              tooltip="Minify and remove unused IDs"
            >
              <Switch
                checked={settings.cleanupIds}
                onCheckedChange={(checked) =>
                  updateSetting('cleanupIds', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Collapse Groups"
              tooltip="Collapse useless groups"
            >
              <Switch
                checked={settings.collapseGroups}
                onCheckedChange={(checked) =>
                  updateSetting('collapseGroups', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Merge Paths"
              tooltip="Merge multiple paths into one when possible"
            >
              <Switch
                checked={settings.mergePaths}
                onCheckedChange={(checked) =>
                  updateSetting('mergePaths', checked)
                }
                disabled={disabled}
              />
            </SettingRow>

            <SettingRow
              label="Convert Shapes to Paths"
              tooltip="Convert basic shapes to path elements (may increase size)"
            >
              <Switch
                checked={settings.convertShapesToPath}
                onCheckedChange={(checked) =>
                  updateSetting('convertShapesToPath', checked)
                }
                disabled={disabled}
              />
            </SettingRow>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsPanel;
