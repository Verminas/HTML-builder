const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  const cssFiles = files.filter(file => path.extname(file) === '.css');

  const fileReadPromises = cssFiles.map(file => {
    const filePath = path.join(stylesDir, file);
    return fs.promises.readFile(filePath, 'utf8');
  });

  Promise.all(fileReadPromises)
    .then(cssData => {
      const bundleCSS = cssData.join('\n');
      return fs.promises.writeFile(outputFile, bundleCSS);
    })
});