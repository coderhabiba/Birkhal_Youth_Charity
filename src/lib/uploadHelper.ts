import fs from 'fs';
import path from 'path';

const ALLOWED_EXTENSIONS: Record<string, string> = {
  'jpeg': 'jpg',
  'jpg': 'jpg',
  'png': 'png',
  'webp': 'webp',
  'gif': 'gif',
  'svg+xml': 'svg',
  'svg': 'svg',
};

const MAX_BASE64_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

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

    // Guard against excessive buffer memory consumption
    if (base64Data.length > MAX_BASE64_SIZE_BYTES * 1.4) {
      console.warn('Upload rejected: file size exceeds allowed limit');
      return '';
    }

    const typeMatch = meta.match(/data:image\/([a-zA-Z0-9+.-]+);base64/i);
    const rawExt = typeMatch ? typeMatch[1].toLowerCase() : 'jpg';
    
    // Strict extension whitelisting - rejects executable, script, or unknown mime types
    const ext = ALLOWED_EXTENSIONS[rawExt] || 'jpg';

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize prefix to prevent directory traversal in generated filename
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'img';
    const filename = `${safePrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const filePath = path.resolve(uploadsDir, filename);

    // Extra sanity check
    if (!filePath.startsWith(uploadsDir)) {
      return '';
    }

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return dataUrl;
  }
}
