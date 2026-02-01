// SVGO Configuration for IvanPress
import { optimize } from 'svgo';

export interface CompressionSettings {
  precision: number;
  multipass: boolean;
  removeComments: boolean;
  removeMetadata: boolean;
  removeTitle: boolean;
  removeDesc: boolean;
  removeUselessDefs: boolean;
  cleanupIds: boolean;
  convertShapesToPath: boolean;
  removeViewBox: boolean;
  removeHiddenElements: boolean;
  collapseGroups: boolean;
  mergePaths: boolean;
}

export const defaultSettings: CompressionSettings = {
  precision: 3,
  multipass: true,
  removeComments: true,
  removeMetadata: true,
  removeTitle: false,
  removeDesc: false,
  removeUselessDefs: true,
  cleanupIds: true,
  convertShapesToPath: false,
  removeViewBox: false,
  removeHiddenElements: true,
  collapseGroups: true,
  mergePaths: true,
};

export function createSvgoConfig(settings: CompressionSettings) {
  return {
    multipass: settings.multipass,
    floatPrecision: settings.precision,
    plugins: [
      {
        name: 'preset-default' as const,
        params: {
          overrides: {
            removeComments: settings.removeComments,
            removeMetadata: settings.removeMetadata,
            removeTitle: settings.removeTitle,
            removeDesc: settings.removeDesc,
            removeUselessDefs: settings.removeUselessDefs,
            cleanupIds: settings.cleanupIds,
            convertShapeToPath: settings.convertShapesToPath,
            removeViewBox: settings.removeViewBox,
            removeHiddenElems: settings.removeHiddenElements,
            collapseGroups: settings.collapseGroups,
            mergePaths: settings.mergePaths,
          },
        },
      },
    ],
  };
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  compressedContent: string;
  originalContent: string;
}

export async function compressSVG(
  svgContent: string,
  settings: CompressionSettings
): Promise<CompressionResult> {
  const originalSize = new Blob([svgContent]).size;
  
  const config = createSvgoConfig(settings);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = optimize(svgContent, config as any);
  
  const compressedContent = result.data;
  const compressedSize = new Blob([compressedContent]).size;
  const savedBytes = originalSize - compressedSize;
  const savedPercentage = originalSize > 0 
    ? Math.round((savedBytes / originalSize) * 100) 
    : 0;
  
  return {
    originalSize,
    compressedSize,
    savedBytes,
    savedPercentage,
    compressedContent,
    originalContent: svgContent,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
