const fs = require('fs');

const FILE_PATH = process.argv[2] || 'beers.json';

fs.writeFileSync(FILE_PATH, JSON.stringify({}));
console.log(`Beers cleared from ${FILE_PATH}`);
