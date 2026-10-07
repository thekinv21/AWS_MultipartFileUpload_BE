/**
 * "report.PDF" → "pdf"; uzantısı olmayan ya da noktayla başlayan adlarda undefined.
 */

export const getFileExtension = (fileName: string): string | undefined => {
  const dotIndex = fileName.lastIndexOf('.');

  return dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : undefined;
};
