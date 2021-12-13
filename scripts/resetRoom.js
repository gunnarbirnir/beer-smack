const readline = require('readline');

const roomActions = require('./roomActions');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Are you sure? (y/n): ', function (confirm) {
  if (confirm === 'y') {
    roomActions.resetRoom(process.argv[2]).then((room) => {
      console.log(`Room ${room.title} has been reset`);
      process.exit();
    });
  } else {
    console.log('Reset canceled');
    process.exit();
  }
});
