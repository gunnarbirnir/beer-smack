const roomActions = require('./roomActions');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Room code: ', function (code) {
  rl.question('Room title: ', function (title) {
    rl.question('Is it a blind tasting (y/n): ', function (isBlind) {
      rl.question('Beers file (beers.json): ', function (file) {
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
