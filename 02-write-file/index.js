const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = '02-write-file.txt';
const filePath = path.join(__dirname, fileName);

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Welcome! Enter text or enter "exit" to complete.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('close', () => {
  console.log('Goodbye!');
  writeStream.end();
});

process.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
});