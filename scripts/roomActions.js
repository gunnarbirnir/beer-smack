const firebase = require('firebase/app');
require('firebase/database');
require('dotenv').config();

const PAGE_URL = process.env.WEB_PAGE_URL;

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

async function createRoom(room) {
  const codeRegex = new RegExp(/^[a-zA-Z0-9\-_]+$/);
  if (!room.code.match(codeRegex)) {
    console.log(`Code ${room.code} not valid (regex: /^[a-zA-Z0-9\-_]+$/)`);
    process.exit(1);
  }

  try {
    const snapshot = await firebase
      .database()
      .ref(`rooms/${room.code}`)
      .once('value');

    if (snapshot.exists()) {
      console.log('Room code already exists');
      process.exit(1);
    } else {
      await setRoomValues(room);
      console.log(`Room ${room.title} created`);
      console.log(`Room URL: ${PAGE_URL}/${room.code}`);
      console.log(`Admin: ${PAGE_URL}/${room.code}/admin`);
      console.log(`Status: ${PAGE_URL}/${room.code}/status`);
      process.exit();
    }
  } catch {
    console.log('Unable to create room');
    process.exit(1);
  }
}

async function getCurrentRoom(code) {
  try {
    const snapshot = await firebase
      .database()
      .ref(`rooms/${code}`)
      .once('value');

    if (snapshot.exists()) {
      const currentRoom = snapshot.val();
      if (currentRoom.hasStarted) {
        console.log("Tasting has started so room can't be updated");
        process.exit(1);
      } else {
        return currentRoom;
      }
    } else {
      console.log('Room not found');
      process.exit(1);
    }
  } catch (err) {
    console.log('Unable fetch current room');
    process.exit(1);
  }
}

async function updateRoom(newRoom, currentRoom) {
  await setRoomValues(newRoom, currentRoom);
  console.log(`Room ${newRoom.title} updated`);
  process.exit();
}

async function setRoomValues(newRoom, currentRoom = {}) {
  const timestamp = Date.now();
  const newBeers = {};

  if (!newRoom.title) {
    console.log('A title must be provided');
    process.exit(1);
  }
  validateBeers(newRoom.beers);

  Object.keys(newRoom.beers).forEach((id) => {
    const currentBeer =
      currentRoom.beers && currentRoom.beers[id] ? currentRoom.beers[id] : {};

    newBeers[id] = {
      index: 0,
      active: true,
      created: timestamp,
      ...currentBeer,
      ...newRoom.beers[id],
      id,
    };

    // TOO: fix
    if (JSON.stringify(newBeers[id]) !== JSON.stringify(currentBeer)) {
      newBeers[id].lastUpdate = timestamp;
    }
  });

  try {
    await firebase
      .database()
      .ref(`rooms/${newRoom.code}`)
      .set({
        created: timestamp,
        ...currentRoom,
        code: newRoom.code,
        title: newRoom.title,
        isBlind: newRoom.isBlind,
        lastUpdate: timestamp,
        hasStarted: false,
        beers: newBeers,
      });
  } catch {
    console.log('Unable update room');
    process.exit(1);
  }
}

function validateBeers(beers) {
  const requiredFields = [
    'name',
    'type',
    'abv',
    'brewer',
    'country',
    'description',
  ];

  Object.values(beers).forEach((beer) => {
    const missing = [];
    requiredFields.forEach((field) => {
      if (!beer[field] && beer[field] !== 0) {
        missing.push(field);
      }
    });

    if (missing.length) {
      const missingStr = missing.join(', ');
      if (beer.name) {
        console.log(
          `The beer ${beer.name} has some missing fields: ${missingStr}`
        );
      } else {
        console.log(`A beer has some missing fields: ${missingStr}`);
      }
      process.exit(1);
    }
  });
}

module.exports = {
  createRoom,
  getCurrentRoom,
  updateRoom,
};
