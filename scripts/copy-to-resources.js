import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const resourcesDir = path.resolve('src/main/resources');
const targetClassesDir = path.resolve('target/classes');

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(distDir)) {
  console.log('[NetBeans Sync] Copying dist/ to src/main/resources/...');
  copyFolder(distDir, resourcesDir);

  if (fs.existsSync(targetClassesDir)) {
    console.log('[NetBeans Sync] Copying dist/ to target/classes/...');
    copyFolder(distDir, targetClassesDir);
  }
  console.log('[NetBeans Sync] Selesai! Aplikasi siap dijalankan di Apache NetBeans tanpa dev server.');
} else {
  console.error('[NetBeans Sync] Folder dist/ belum ada. Jalankan vite build terlebih dahulu.');
}
