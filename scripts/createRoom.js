const readline = require('readline');

const roomActions = require('./roomActions');

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
        roomActions.createRoom({
          code,
          title,
          isBlind: isBlind === 'y',
          beers,
        });
      });
    });
  });
});
