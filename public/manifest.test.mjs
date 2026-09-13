import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');

describe('web app manifest', () => {
  it('references valid regular and maskable PNG icons', async () => {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

    expect(manifest.display).toBe('standalone');
    expect(manifest.id).toBe('/');
    expect(manifest.scope).toBe('/');

    const expectedIcons = [
      ['/icons/icon-192x192.png', 192, 'any'],
      ['/icons/icon-512x512.png', 512, 'any'],
      ['/icons/icon-maskable-512x512.png', 512, 'maskable'],
    ];

    for (const [src, size, purpose] of expectedIcons) {
      expect(manifest.icons).toContainEqual({
        src,
        type: 'image/png',
        sizes: `${size}x${size}`,
        purpose,
      });

      const iconPath = path.join(process.cwd(), 'public', src);
      const metadata = await sharp(iconPath).metadata();

      expect(metadata.format).toBe('png');
      expect(metadata.width).toBe(size);
      expect(metadata.height).toBe(size);
    }
  });

  it('provides the Apple touch icon sizes referenced by the layout', async () => {
    for (const size of [152, 180]) {
      const iconPath = path.join(
        process.cwd(),
        'public',
        'icons',
        `apple-touch-icon-${size}x${size}.png`
      );
      const metadata = await sharp(iconPath).metadata();

      expect(metadata.format).toBe('png');
      expect(metadata.width).toBe(size);
      expect(metadata.height).toBe(size);
    }
  });
});
