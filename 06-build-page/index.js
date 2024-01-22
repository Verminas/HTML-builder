const fs = require('fs').promises;
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
fs.mkdir(projectPath, { recursive: true });

const assetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(projectPath, 'assets');
fs.mkdir(copyAssetsPath, { recursive: true });

async function createNewPage() {
  const templatePath = path.join(__dirname, 'template.html');
  const newPage = path.join(projectPath, 'index.html');
  
  const componentsPath = path.join(__dirname, 'components');
  const articlesPath = path.join(componentsPath, 'articles.html');
  const footerPath = path.join(componentsPath, 'footer.html');
  const headerPath = path.join(componentsPath, 'header.html');

  const articlesData = await fs.readFile(articlesPath, 'utf-8');
  const footerData = await fs.readFile(footerPath, 'utf-8');
  const headerData = await fs.readFile(headerPath, 'utf-8');

  try {
    let pageData = await fs.readFile(templatePath, 'utf-8');
    pageData = pageData.replace('{{header}}', headerData);
    pageData = pageData.replace('{{articles}}', articlesData);
    pageData = pageData.replace('{{footer}}', footerData);
    await fs.writeFile(newPage, pageData);
    console.log('Index.html is created sucsessful');

  } catch(error) {
    console.log('There is a error: ', error);
  }
}
createNewPage();

async function createStyleFile() {
  let allStyleData = '';
  const newStyleFile = path.join(projectPath, 'style.css');
  const stylesDir = path.join(__dirname, 'styles');
  const styleFiles = ['01-header.css', '02-main.css', '03-footer.css'];

  try {
    for (const styleFile of styleFiles) {
      const filePath = path.join(stylesDir, styleFile);
      const fileData = await fs.readFile(filePath, 'utf-8');
      allStyleData += fileData;
    }
    await fs.writeFile(newStyleFile, allStyleData);
    console.log('Style.css is created sucsessful');

  } catch(error) {
    console.log('There is a error: ', error);
  }
}
createStyleFile();

async function copyFolders() {
  try {
    await copyDir(assetsPath, copyAssetsPath);
    console.log('The folder "assets" is copied sucsessful');

  } catch(error) {
    console.log('There is a error with copy folder assets: ', error);
  }
}
copyFolders();

async function copyDir(sourceDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const files = await fs.readdir(sourceDir);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    const stat = await fs.stat(sourcePath);

    if (stat.isFile()) {   
      await fs.copyFile(sourcePath, destPath);
    } else if (stat.isDirectory()) {
    await copyDir(sourcePath, destPath);
    }
  }
}
  