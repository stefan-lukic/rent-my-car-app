import { describe, expect, it } from 'vitest';
import { validateImageUploads } from './imageUploadValidation';

const createImage = (size: number, type = 'image/jpeg') =>
  new File([new Uint8Array(size)], 'image.jpg', { type });

describe('validateImageUploads', () => {
  it('accepts up to five JPEG, PNG, or WebP images within the size limits', () => {
    const files = [
      createImage(100, 'image/jpeg'),
      createImage(100, 'image/png'),
      createImage(100, 'image/webp'),
    ];

    expect(validateImageUploads(files)).toEqual({ files, error: null });
  });

  it('rejects unsupported file types', () => {
    expect(validateImageUploads([createImage(100, 'image/gif')]).error).toBe(
      'Only JPEG, PNG, and WebP images are allowed'
    );
  });

  it('rejects more than five images', () => {
    const files = Array.from({ length: 6 }, () => createImage(100));

    expect(validateImageUploads(files).error).toBe(
      'You can upload up to 5 images'
    );
  });

  it('rejects an image larger than five megabytes', () => {
    const file = createImage(5 * 1024 * 1024 + 1);

    expect(validateImageUploads([file]).error).toBe(
      'Each image must be 5 MB or smaller'
    );
  });

  it('rejects images larger than ten megabytes in total', () => {
    const files = Array.from({ length: 3 }, () => createImage(4 * 1024 * 1024));

    expect(validateImageUploads(files).error).toBe(
      'Images must be 10 MB or smaller in total'
    );
  });

  it('rejects empty files and non-file form values', () => {
    expect(validateImageUploads([createImage(0)]).error).toBe(
      'Image files cannot be empty'
    );
    expect(validateImageUploads(['not-a-file']).error).toBe(
      'Invalid image upload'
    );
  });
});
