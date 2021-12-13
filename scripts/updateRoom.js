const readline = require('readline');

const roomActions = require('./roomActions');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

roomActions.getCurrentRoom(process.argv[2]).then((currentRoom) => {
  getUserInput(currentRoom);
});

function getUserInput(currentRoom) {
  rl.question(`Room title (${currentRoom.title}): `, function (title) {
    rl.question('Is it a blind tasting (y/n): ', function (isBlind) {
      rl.question('Beers file (beers.json): ', async function (file) {
        console.log();
        const beers = require(file ? `../${file}` : '../beers.json');
        const newTitle = title || currentRoom.title;

        await roomActions.updateRoom(
          {
            code: currentRoom.code,
            title: newTitle,
            isBlind: isBlind ? isBlind === 'y' : currentRoom.isBlind,
            beers,
          },
          currentRoom
        );

        console.log(`Room ${newTitle} updated`);
        process.exit();
      });
    });
  });
}
