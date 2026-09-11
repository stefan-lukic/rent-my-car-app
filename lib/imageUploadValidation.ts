const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

// Limit decoded dimensions to reduce CPU and memory use from oversized images.
export const MAX_IMAGE_PIXELS = 25_000_000;

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type ImageUploadValidation = {
  files: File[];
  error: string | null;
};

export function validateImageUploads(
  entries: FormDataEntryValue[]
): ImageUploadValidation {
  const files = entries.filter(
    (entry): entry is File => typeof entry !== 'string'
  );

  if (files.length !== entries.length) {
    return { files: [], error: 'Invalid image upload' };
  }

  if (files.length > MAX_IMAGE_COUNT) {
    return {
      files: [],
      error: `You can upload up to ${MAX_IMAGE_COUNT} images`,
    };
  }

  let totalSize = 0;

  for (const file of files) {
    // Reject unsafe metadata before arrayBuffer loads the file into memory.
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return {
        files: [],
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    if (file.size === 0) {
      return { files: [], error: 'Image files cannot be empty' };
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { files: [], error: 'Each image must be 5 MB or smaller' };
    }

    totalSize += file.size;
  }

  if (totalSize > MAX_TOTAL_IMAGE_SIZE_BYTES) {
    return { files: [], error: 'Images must be 10 MB or smaller in total' };
  }

  return { files, error: null };
}
