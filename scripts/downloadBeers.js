const fs = require('fs');

const roomActions = require('./roomActions');

const FILE_PATH = process.argv[3] || 'beers.json';

roomActions.downloadBeers(process.argv[2]).then((beers) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(beers, null, 2));
  console.log(`Beers written to ${FILE_PATH}`);
  process.exit();
});
