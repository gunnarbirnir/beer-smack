const readline = require('readline');

const roomActions = require('./roomActions');

const PAGE_URL = process.env.WEB_PAGE_URL;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Room code: ', function (code) {
  rl.question('Room title: ', function (title) {
    rl.question('Is it a blind tasting (y/n): ', function (isBlind) {
      rl.question('Beers file (beers.json): ', async function (file) {
        console.log();
        const beers = require(file ? `../${file}` : '../beers.json');

        await roomActions.createRoom({
          code,
          title,
          isBlind: isBlind === 'y',
          beers,
        });

        console.log(`Room ${title} created`);
        console.log(`Room URL: ${PAGE_URL}/${code}`);
        console.log(`Admin: ${PAGE_URL}/${code}/admin`);
        console.log(`Status: ${PAGE_URL}/${code}/status`);
        process.exit();
      });
    });
  });
});
