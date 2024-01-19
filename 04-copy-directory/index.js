const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');
let isCopying = false;

async function copyDir() {
  await cleanDestinationDir();
  await fs.mkdir(destinationDir, { recursive: true });
  await copyFiles();
  watchSourceDir();
}

async function cleanDestinationDir() {
  const destinationExists = await fs.access(destinationDir, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

    if (destinationExists) {
      const files = await fs.readdir(destinationDir);
      for (const file of files) {
        const filePath = path.join(destinationDir, file);
        await fs.unlink(filePath);
      }
      await fs.rmdir(destinationDir);
    }
}

async function copyFile(source, destination) {
  const fileData = await fs.readFile(source);
  await fs.writeFile(destination, fileData);
}

async function copyFiles() {
  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);
    await copyFile(sourcePath, destinationPath);
  }
}

function watchSourceDir() {
  fs.watch(sourceDir, { recursive: true }, async (eventType, filename) => {
    const sourcePath = path.join(sourceDir, filename);
    const destinationPath = path.join(destinationDir, filename);

    if (isCopying) return;
    isCopying = true;

      if (eventType === 'rename' || eventType === 'change') {
        await copyFile(sourcePath, destinationPath);
      } else if (eventType === 'unlink') {
        await fs.unlink(destinationPath);
      }
    isCopying = false;
  });
}

copyDir();