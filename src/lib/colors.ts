// Extract dominant colors from an image
// Used to make each EPK feel unique to the artist's aesthetic

export interface ColorPalette {
  dominant: string;
  muted: string;
  accent: string;
  text: string;
  textMuted: string;
  background: string;
  isDark: boolean;
}

// Default palette for when no image is available
export const defaultPalette: ColorPalette = {
  dominant: '#1a1a1a',
  muted: '#2a2a2a',
  accent: '#a855f7',
  text: '#ffffff',
  textMuted: '#a1a1a1',
  background: '#0a0a0a',
  isDark: true,
};

// Calculate relative luminance of a color
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Check if color is dark
function isDarkColor(r: number, g: number, b: number): boolean {
  return getLuminance(r, g, b) < 0.5;
}

// Darken a color
function darken(r: number, g: number, b: number, amount: number): string {
  return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
}

// Lighten a color
function lighten(r: number, g: number, b: number, amount: number): string {
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`;
}

// Desaturate a color
function desaturate(r: number, g: number, b: number, amount: number): string {
  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return `rgb(${Math.round(r + (gray - r) * amount)}, ${Math.round(g + (gray - g) * amount)}, ${Math.round(b + (gray - b) * amount)})`;
}

// Extract colors from an image using canvas
export async function extractColors(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(defaultPalette);
        return;
      }

      // Sample a smaller version for performance
      const sampleSize = 50;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const pixels = imageData.data;

      // Collect color samples
      const colorCounts: Map<string, { r: number; g: number; b: number; count: number }> = new Map();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 10) * 10;
        const g = Math.round(pixels[i + 1] / 10) * 10;
        const b = Math.round(pixels[i + 2] / 10) * 10;

        // Skip very light or very dark pixels for dominant color
        const luminance = getLuminance(r, g, b);
        if (luminance > 0.05 && luminance < 0.95) {
          const key = `${r},${g},${b}`;
          const existing = colorCounts.get(key);
          if (existing) {
            existing.count++;
          } else {
            colorCounts.set(key, { r, g, b, count: 1 });
          }
        }
      }

      // Find dominant color
      let dominant = { r: 30, g: 30, b: 30 };
      let maxCount = 0;

      colorCounts.forEach((value) => {
        if (value.count > maxCount) {
          maxCount = value.count;
          dominant = { r: value.r, g: value.g, b: value.b };
        }
      });

      const isDark = isDarkColor(dominant.r, dominant.g, dominant.b);

      // Build palette based on dominant color
      const palette: ColorPalette = {
        dominant: `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`,
        muted: desaturate(dominant.r, dominant.g, dominant.b, 0.5),
        accent: isDark
          ? lighten(dominant.r, dominant.g, dominant.b, 80)
          : darken(dominant.r, dominant.g, dominant.b, 40),
        text: isDark ? '#ffffff' : '#111111',
        textMuted: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        background: isDark
          ? darken(dominant.r, dominant.g, dominant.b, 60)
          : lighten(dominant.r, dominant.g, dominant.b, 60),
        isDark,
      };

      resolve(palette);
    };

    img.onerror = () => {
      resolve(defaultPalette);
    };

    img.src = imageUrl;
  });
}

// Generate CSS variables from palette
export function paletteToCSS(palette: ColorPalette): Record<string, string> {
  return {
    '--color-dominant': palette.dominant,
    '--color-muted': palette.muted,
    '--color-accent': palette.accent,
    '--color-text': palette.text,
    '--color-text-muted': palette.textMuted,
    '--color-background': palette.background,
  };
}
