// Image to SVG Vectorizer Configuration
import ImageTracer from 'imagetracerjs';

export interface VectorizerSettings {
  // Color quantization
  colorCount: number;
  // Path tracing
  pathomit: number; // Omit paths smaller than this (px)
  blurRadius: number;
  blurDelta: number;
  // Line threshold
  lineThreshold: number;
  // Curve threshold  
  curveThreshold: number;
  // SVG rendering
  strokeWidth: number;
  scale: number;
  // Mode
  mode: 'color' | 'grayscale' | 'black-white';
}

export const defaultSettings: VectorizerSettings = {
  colorCount: 16,
  pathomit: 8,
  blurRadius: 0,
  blurDelta: 20,
  lineThreshold: 1,
  curveThreshold: 1,
  strokeWidth: 1,
  scale: 1,
  mode: 'color',
};

export const presets = {
  detailed: {
    colorCount: 64,
    pathomit: 4,
    blurRadius: 0,
    blurDelta: 20,
    lineThreshold: 1,
    curveThreshold: 1,
    strokeWidth: 1,
    scale: 1,
    mode: 'color' as const,
  },
  simplified: {
    colorCount: 8,
    pathomit: 16,
    blurRadius: 2,
    blurDelta: 40,
    lineThreshold: 2,
    curveThreshold: 2,
    strokeWidth: 1,
    scale: 1,
    mode: 'color' as const,
  },
  blackWhite: {
    colorCount: 2,
    pathomit: 8,
    blurRadius: 1,
    blurDelta: 20,
    lineThreshold: 1,
    curveThreshold: 1,
    strokeWidth: 1,
    scale: 1,
    mode: 'black-white' as const,
  },
  poster: {
    colorCount: 4,
    pathomit: 8,
    blurRadius: 4,
    blurDelta: 64,
    lineThreshold: 1,
    curveThreshold: 1,
    strokeWidth: 1,
    scale: 1,
    mode: 'color' as const,
  },
};

function getImageTracerOptions(settings: VectorizerSettings) {
  const baseOptions = {
    numberofcolors: settings.colorCount,
    pathomit: settings.pathomit,
    blurradius: settings.blurRadius,
    blurdelta: settings.blurDelta,
    ltres: settings.lineThreshold,
    qtres: settings.curveThreshold,
    strokewidth: settings.strokeWidth,
    scale: settings.scale,
  };

  if (settings.mode === 'black-white') {
    return {
      ...baseOptions,
      numberofcolors: 2,
      colorsampling: 0,
      colorquantcycles: 1,
    };
  }

  if (settings.mode === 'grayscale') {
    return {
      ...baseOptions,
      colorsampling: 0,
    };
  }

  return baseOptions;
}

export interface VectorizationResult {
  originalSize: number;
  svgSize: number;
  svgContent: string;
  originalWidth: number;
  originalHeight: number;
}

export function vectorizeImage(
  imageData: ImageData,
  settings: VectorizerSettings,
  originalFileSize: number
): Promise<VectorizationResult> {
  return new Promise((resolve, reject) => {
    try {
      const options = getImageTracerOptions(settings);
      const svgString = ImageTracer.imagedataToSVG(imageData, options);
      
      const svgSize = new Blob([svgString]).size;

      resolve({
        originalSize: originalFileSize,
        svgSize,
        svgContent: svgString,
        originalWidth: imageData.width,
        originalHeight: imageData.height,
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function loadImageToCanvas(file: File): Promise<{ imageData: ImageData; canvas: HTMLCanvasElement }> {
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

      // Limit max dimensions for performance
      const maxDim = 1200;
      let { width, height } = img;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height / width) * maxDim;
          width = maxDim;
        } else {
          width = (width / height) * maxDim;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      resolve({ imageData, canvas });
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
