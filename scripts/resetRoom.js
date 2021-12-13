const roomActions = require('./roomActions');

roomActions.resetRoom(process.argv[2]).then((room) => {
  console.log(`Room ${room.title} has been reset`);
  process.exit();
});
