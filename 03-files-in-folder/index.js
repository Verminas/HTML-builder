const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true })
  .then((dirents) => {
    dirents.forEach((dirent) => {
      if (dirent.isFile()) {
        const filePath = path.join(folderPath, dirent.name);
        fs.stat(filePath)
          .then((stats) => {
            const fileName = path.parse(dirent.name).name;
            const fileExtension = path.extname(dirent.name).slice(1);
            const fileSize = stats.size;
            console.log(`${fileName}-${fileExtension}-${fileSize} bytes`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });