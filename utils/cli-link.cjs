const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '..', 'cli', 'src', 'cli');
const link = path.resolve(__dirname, '..', 'src', 'cli');

if (fs.existsSync(link)) {
  fs.unlinkSync(link);
}

fs.symlink(target, link, 'dir', (err) => {
  if (err) throw err;
  console.log('Symlink created from', link, 'to', target);
});

const targetFile = path.resolve(__dirname, '..', 'cli', 'src', 'cli.ts');
const linkFile = path.resolve(__dirname, '..', 'src', 'cli.ts');

if (fs.existsSync(linkFile)) {
  fs.unlinkSync(linkFile);
}

fs.link(targetFile, linkFile, (err) => {
  if (err) throw err;
  console.log('Hard link created from', linkFile, 'to', targetFile);
});