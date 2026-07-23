const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Couleurs HAV OS (palette d'origine — bleu-nuit / cyan / corail)
const BG = [10, 14, 20]; // #0A0E14
const CYAN = [77, 232, 255]; // #4DE8FF
const CORAL = [255, 107, 74]; // #FF6B4A

function createCanvas(width, height, bg) {
  const buf = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = bg[0];
    buf[i * 4 + 1] = bg[1];
    buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = 255;
  }
  return buf;
}

function fillRect(buf, width, x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const i = (y * width + x) * 4;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
      buf[i + 3] = 255;
    }
  }
}

// Dessine un monogramme "H" au centre du canvas, à l'échelle de sa taille
function drawH(buf, width, height, color) {
  const barW = Math.round(Math.min(width, height) * 0.14);
  const glyphH = Math.round(Math.min(width, height) * 0.5);
  const glyphW = Math.round(glyphH * 0.75);
  const x0 = Math.round((width - glyphW) / 2);
  const y0 = Math.round((height - glyphH) / 2);

  fillRect(buf, width, x0, y0, barW, glyphH, color); // barre gauche
  fillRect(buf, width, x0 + glyphW - barW, y0, barW, glyphH, color); // barre droite
  fillRect(buf, width, x0, y0 + Math.round(glyphH / 2) - Math.round(barW / 2), glyphW, barW, color); // barre du milieu
}

function encodePNG(buf, width, height) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Ajoute un octet filtre (0 = none) au début de chaque ligne
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    buf.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idatData = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Implémentation CRC32 standard (nécessaire pour les chunks PNG)
const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size, BG);
  drawH(canvas, size, size, CYAN);
  const png = encodePNG(canvas, size, size);
  fs.writeFileSync(filename, png);
  console.log(`✓ ${filename} (${size}x${size})`);
}

function generateOgImage(filename) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height, BG);

  // Monogramme H à gauche
  const glyphSize = 320;
  const glyphCanvas = createCanvas(glyphSize, glyphSize, BG);
  drawH(glyphCanvas, glyphSize, glyphSize, CYAN);
  const offsetX = 120;
  const offsetY = Math.round((height - glyphSize) / 2);
  for (let y = 0; y < glyphSize; y++) {
    for (let x = 0; x < glyphSize; x++) {
      const src = (y * glyphSize + x) * 4;
      const dstX = offsetX + x;
      const dstY = offsetY + y;
      if (dstX < width && dstY < height) {
        const dst = (dstY * width + dstX) * 4;
        canvas[dst] = glyphCanvas[src];
        canvas[dst + 1] = glyphCanvas[src + 1];
        canvas[dst + 2] = glyphCanvas[src + 2];
        canvas[dst + 3] = 255;
      }
    }
  }

  // Barre d'accent corail à droite (signature visuelle simple, sans texte —
  // le texte nécessiterait un rasterizer de police, hors scope ici)
  fillRect(canvas, width, width - 180, 0, 8, height, CORAL);

  const png = encodePNG(canvas, width, height);
  fs.writeFileSync(filename, png);
  console.log(`✓ ${filename} (${width}x${height})`);
}

const appDir = path.join(__dirname, '../app');
generateIcon(512, path.join(appDir, 'icon.png'));
generateIcon(180, path.join(appDir, 'apple-icon.png'));
generateOgImage(path.join(appDir, 'opengraph-image.png'));
