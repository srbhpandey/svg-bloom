// High-Quality Image to SVG Vectorizer using Potrace WASM + SVGO
import { potrace, init } from 'esm-potrace-wasm';
import { optimize } from 'svgo';

let isInitialized = false;

export interface VectorizerSettings {
  // Posterization level (1-255) - lower = fewer colors = smaller file
  posterizeLevel: number;
  // Curve optimization (0-1.34) - higher = smoother curves
  alphamax: number;
  // Suppress speckles of up to this size (2-10)
  turdsize: number;
  // Curve optimization tolerance (0-1)
  opttolerance: number;
  // Extract colors from image
  extractColors: boolean;
  // Turn policy (how to resolve ambiguities)
  turnpolicy: number;
  // Posterization algorithm (0: simple, 1: interpolation)
  posterizeAlgorithm: number;
}

export const defaultSettings: VectorizerSettings = {
  posterizeLevel: 2, // For logos, 2 is often perfect (black + white or few colors)
  alphamax: 1.0, // Smoother curves (0 = sharp corners, 1.34 = smoothest)
  turdsize: 2, // Remove tiny artifacts
  opttolerance: 0.2, // Curve optimization tolerance
  extractColors: true,
  turnpolicy: 4, // Minority turn policy (best for logos)
  posterizeAlgorithm: 0, // Simple posterization
};

export const presets: Record<string, VectorizerSettings> = {
  logoSharp: {
    posterizeLevel: 2,
    alphamax: 0.8, // Slightly sharper corners
    turdsize: 4,
    opttolerance: 0.1, // Tighter curves
    extractColors: true,
    turnpolicy: 4,
    posterizeAlgorithm: 0,
  },
  logoSmooth: {
    posterizeLevel: 2,
    alphamax: 1.2, // Smoother curves
    turdsize: 3,
    opttolerance: 0.2,
    extractColors: true,
    turnpolicy: 4,
    posterizeAlgorithm: 0,
  },
  blackWhite: {
    posterizeLevel: 2,
    alphamax: 1.0,
    turdsize: 2,
    opttolerance: 0.2,
    extractColors: false,
    turnpolicy: 4,
    posterizeAlgorithm: 0,
  },
  detailed: {
    posterizeLevel: 6,
    alphamax: 1.0,
    turdsize: 2,
    opttolerance: 0.15,
    extractColors: true,
    turnpolicy: 4,
    posterizeAlgorithm: 1,
  },
  ultraCompact: {
    posterizeLevel: 2,
    alphamax: 1.0,
    turdsize: 8, // Remove more noise
    opttolerance: 0.5, // More aggressive curve simplification
    extractColors: true,
    turnpolicy: 4,
    posterizeAlgorithm: 0,
  },
};

async function initPotrace(): Promise<void> {
  if (!isInitialized) {
    await init();
    isInitialized = true;
  }
}

function optimizeSvg(svgString: string): string {
  try {
    const result = optimize(svgString, {
      multipass: true,
      floatPrecision: 1, // Aggressive precision reduction for smaller files
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              cleanupIds: true,
              removeUselessDefs: true,
              removeEmptyContainers: true,
              removeEmptyAttrs: true,
              removeMetadata: true,
              removeComments: true,
              removeTitle: true,
              removeDesc: true,
              removeEditorsNSData: true,
              collapseGroups: true,
              mergePaths: true,
              convertPathData: {
                floatPrecision: 1,
                transformPrecision: 1,
                makeArcs: {
                  threshold: 2.5,
                  tolerance: 0.5,
                },
              },
              convertTransform: {
                floatPrecision: 1,
              },
              cleanupNumericValues: {
                floatPrecision: 1,
              },
            },
          },
        },
      ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    return result.data;
  } catch (error) {
    console.warn('SVGO optimization failed, using original SVG:', error);
    return svgString;
  }
}

export interface VectorizationResult {
  originalSize: number;
  svgSize: number;
  svgContent: string;
  originalWidth: number;
  originalHeight: number;
}

export async function vectorizeImage(
  imageSource: ImageBitmapSource,
  settings: VectorizerSettings,
  originalFileSize: number,
  dimensions: { width: number; height: number }
): Promise<VectorizationResult> {
  await initPotrace();

  // Run Potrace with optimal settings
  const rawSvg = await potrace(imageSource, {
    turdsize: settings.turdsize,
    turnpolicy: settings.turnpolicy,
    alphamax: settings.alphamax,
    opticurve: 1, // Enable curve optimization
    opttolerance: settings.opttolerance,
    pathonly: false,
    extractcolors: settings.extractColors,
    posterizelevel: settings.posterizeLevel,
    posterizationalgorithm: settings.posterizeAlgorithm,
  });

  // Optimize SVG for smallest file size
  const optimizedSvg = optimizeSvg(rawSvg);
  const svgSize = new Blob([optimizedSvg]).size;

  return {
    originalSize: originalFileSize,
    svgSize,
    svgContent: optimizedSvg,
    originalWidth: dimensions.width,
    originalHeight: dimensions.height,
  };
}

export async function loadImageToImageData(
  file: File
): Promise<{ imageData: ImageData; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Use original dimensions for best quality
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      resolve({ imageData, width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
