import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const destinations = {
  pymupdf: {
    srcDir: path.join(projectRoot, 'node_modules/@bentopdf/pymupdf-wasm'),
    destDir: path.join(projectRoot, 'public/wasm/pymupdf'),
    files: [
      { src: 'dist/index.js', dest: 'dist/index.js' },
      { src: 'assets', dest: 'assets', isDir: true }
    ]
  },
  gs: {
    srcDir: path.join(projectRoot, 'node_modules/@bentopdf/gs-wasm/assets'),
    destDir: path.join(projectRoot, 'public/wasm/gs'),
    files: [
      { src: 'gs.js', dest: 'gs.js' },
      { src: 'gs.wasm', dest: 'gs.wasm' }
    ]
  },
  cpdf: {
    srcDir: path.join(projectRoot, 'node_modules/coherentpdf/dist'),
    destDir: path.join(projectRoot, 'public/wasm/cpdf'),
    files: [
      { src: 'coherentpdf.browser.min.js', dest: 'coherentpdf.browser.min.js' }
    ]
  }
};

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying WASM/JS assets from node_modules to public/wasm...');

for (const [key, config] of Object.entries(destinations)) {
  console.log(`Copying ${key} assets...`);
  if (!fs.existsSync(config.srcDir)) {
    console.error(`Error: Source directory not found: ${config.srcDir}. Did you run npm install?`);
    process.exit(1);
  }

  for (const file of config.files) {
    const srcPath = path.join(config.srcDir, file.src);
    const destPath = path.join(config.destDir, file.dest);

    if (file.isDir) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('All WASM/JS assets copied successfully!');
