import fs from 'node:fs';
import path from 'node:path';

const ontologyPath = path.resolve('src/lib/ontologyData.json');
const semantikDir = path.resolve('semantik');
const targetDirs = [
  path.resolve('gambar'),
  path.resolve('public/gambar'),
  path.resolve('src/main/resources/gambar'),
  path.resolve('target/classes/gambar'),
  path.resolve('dist/gambar'),
];

if (!fs.existsSync(semantikDir)) {
  console.error('Folder semantik tidak ditemukan!');
  process.exit(1);
}

const ontologyData = JSON.parse(fs.readFileSync(ontologyPath, 'utf8'));
const semantikFiles = fs.readdirSync(semantikDir);

// Mapping rules
function getNormalizedFileName(id, originalFileName) {
  const ext = path.extname(originalFileName);
  return `${id}${ext}`;
}

const manifest = {};

ontologyData.batiks.forEach((b) => {
  const cleanId = b.id.toLowerCase();
  const foundFile = semantikFiles.find((f) => {
    const fClean = f.toLowerCase();
    if (fClean.startsWith(cleanId + '.')) return true;
    if (cleanId === 'batik_asmat' && fClean.includes('asmat')) return true;
    if (cleanId === 'batik_tambal' && fClean.includes('tambal')) return true;
    return false;
  });

  if (foundFile) {
    const targetName = getNormalizedFileName(b.id, foundFile);
    manifest[b.id] = targetName;
    const srcPath = path.join(semantikDir, foundFile);

    targetDirs.forEach((targetDir) => {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const destPath = path.join(targetDir, targetName);
      fs.copyFileSync(srcPath, destPath);
    });
    console.log(`Copied & normalized: ${foundFile} -> ${targetName}`);
  } else {
    console.warn(`WARNING: File tidak ditemukan untuk ${b.id}`);
  }
});

// Save imageManifest.json for frontend
const manifestPath = path.resolve('src/lib/imageManifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Manifest saved to ${manifestPath} (${Object.keys(manifest).length} items).`);
