import fs from 'fs';
import path from 'path';

/**
 * Saves a base64 Data URL to public/uploads and returns the public URL (/uploads/filename.ext).
 * If the input is already a URL or not base64, returns it unchanged.
 */
export function processBase64Image(dataUrl: string, prefix: string = 'img'): string {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  try {
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex === -1) return dataUrl;

    const meta = dataUrl.substring(0, commaIndex);
    const base64Data = dataUrl.substring(commaIndex + 1);

    const typeMatch = meta.match(/data:image\/([a-zA-Z0-9+.-]+);base64/i);
    let ext = typeMatch ? typeMatch[1].toLowerCase() : 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return dataUrl;
  }
}
