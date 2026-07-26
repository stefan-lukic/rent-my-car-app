export const createFileChangeEvent = (file: File) =>
  ({
    target: {
      name: 'image',
      type: 'file',
      files: [file],
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

export const createMultiFileChangeEvent = (files: File[]) =>
  ({
    target: {
      name: 'images',
      type: 'file',
      files,
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;