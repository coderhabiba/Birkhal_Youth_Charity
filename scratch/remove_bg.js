const sharp = require('sharp');
const fs = require('fs');

async function processLogo() {
  const { data, info } = await sharp('public/logo.jpeg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const rgbaData = Buffer.alloc(width * height * 4);

  // Flood fill or distance-based background removal from the outer borders
  // Or check luminance / color distance from white / light grey
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Helper to get index
  const getIdx = (x, y) => y * width + x;

  // Add boundary pixels
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
    visited[getIdx(x, 0)] = 1;
    visited[getIdx(x, height - 1)] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
    visited[getIdx(0, y)] = 1;
    visited[getIdx(width - 1, y)] = 1;
  }

  // A pixel is considered background if it's very bright (white/near-white/light gray)
  // or connected to the outside bright area
  const isBgColor = (r, g, b) => {
    // Check if close to white or gray background
    const brightness = (r + g + b) / 3;
    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    return (brightness > 200 && diff < 30) || (brightness > 230);
  };

  let head = 0;
  while (head < queue.length) {
    const [x, y] = queue[head++];
    const pIdx = (y * width + x) * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    if (isBgColor(r, g, b)) {
      visited[getIdx(x, y)] = 2; // confirmed background

      // Check 4 neighbors
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = getIdx(nx, ny);
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            const npIdx = (ny * width + nx) * channels;
            const nr = data[npIdx];
            const ng = data[npIdx + 1];
            const nb = data[npIdx + 2];
            if (isBgColor(nr, ng, nb)) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
  }

  // Construct RGBA buffer
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIdx(x, y);
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      rgbaData[dstIdx] = r;
      rgbaData[dstIdx + 1] = g;
      rgbaData[dstIdx + 2] = b;

      if (visited[idx] === 2) {
        rgbaData[dstIdx + 3] = 0; // Transparent
      } else {
        // Check if pure white
        if (r > 245 && g > 245 && b > 245) {
          rgbaData[dstIdx + 3] = 0;
        } else {
          rgbaData[dstIdx + 3] = 255;
        }
      }
    }
  }

  await sharp(rgbaData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile('public/logo.png');

  console.log('Successfully created public/logo.png with transparent background!');
}

processLogo().catch(console.error);
