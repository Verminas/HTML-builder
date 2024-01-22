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
  const componentsFiles = await fs.readdir(componentsPath);

  try {
    let pageData = await fs.readFile(templatePath, 'utf-8');
    for (const componentFile of componentsFiles) {
      const componentPath = path.join(componentsPath, componentFile);
      const componentData = await fs.readFile(componentPath, 'utf-8');
      const componentName = path.basename(componentFile, path.extname(componentFile));
      pageData = pageData.replace(`{{${componentName}}}`, componentData);
    }
    await fs.writeFile(newPage, pageData);
    console.log('Index.html is created sucsessful');

  } catch(error) {
    console.log('There is a error: ', error);
  }
}

async function createStyleFile() {
  let allStyleData = '';
  const newStyleFile = path.join(projectPath, 'style.css');
  const stylesDir = path.join(__dirname, 'styles');
  const styleFiles = await fs.readdir(stylesDir);

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

async function copyFolders() {
  try {
    await copyDir(assetsPath, copyAssetsPath);
    console.log('The folder "assets" is copied sucsessful');

  } catch(error) {
    console.log('There is a error with copy folder assets: ', error);
  }
}

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

createNewPage();
createStyleFile();
copyFolders();