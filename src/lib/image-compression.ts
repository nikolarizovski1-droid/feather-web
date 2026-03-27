import imageCompression from 'browser-image-compression';

export async function compressImage(
  file: File,
  options: { maxSizeMB?: number; maxWidthOrHeight?: number } = {},
): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: options.maxSizeMB ?? 2,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
    useWebWorker: true,
  });
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await fileToDataURL(file);
  return dataUrl.replace(/^data:[^;]+;base64,/, '');
}
