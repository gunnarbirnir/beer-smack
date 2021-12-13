const firebase = require('firebase/app');
require('firebase/database');
require('dotenv').config();

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
    error(`Code ${room.code} not valid (regex: /^[a-zA-Z0-9\-_]+$/)`);
  }
  if (!room.title) {
    error('A title must be provided');
  }

  try {
    const snapshot = await firebase
      .database()
      .ref(`rooms/${room.code}`)
      .once('value');

    if (snapshot.exists()) {
      error('Room code already exists');
    } else {
      await updateRoom(room);
    }
  } catch (err) {
    error('Unable to create room');
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
        error("Tasting has started so room can't be updated");
      } else {
        return currentRoom;
      }
    } else {
      error('Room not found');
    }
  } catch (err) {
    error('Unable fetch current room');
  }
}

async function updateRoom(newRoom, currentRoom = {}) {
  const timestamp = Date.now();
  const newBeers = validateBeers(
    newRoom.beers,
    currentRoom.beers,
    timestamp,
    newRoom.isBlind
  );

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
    error('Unable update room');
  }
}

async function downloadBeers(code) {
  try {
    const snapshot = await firebase
      .database()
      .ref(`rooms/${code}/beers`)
      .once('value');

    if (snapshot.exists()) {
      const currentBeers = snapshot.val();
      const beers = {};

      Object.keys(currentBeers).forEach((id) => {
        const currentBeer = currentBeers[id];
        beers[id] = {
          id: currentBeer.id,
          name: currentBeer.name,
          type: currentBeer.type,
          index: currentBeer.index,
          active: currentBeer.active,
          abv: currentBeer.abv,
          brewer: currentBeer.brewer,
          country: currentBeer.country,
          description: currentBeer.description,
        };
      });

      return beers;
    } else {
      error('Beers not found');
    }
  } catch (err) {
    error('Unable download beers');
  }
}

function validateBeers(newBeers, currentBeers = {}, timestamp, isBlind) {
  const validatedBeers = {};
  const requiredFields = [
    'name',
    'type',
    'abv',
    'brewer',
    'country',
    'description',
  ];

  Object.values(newBeers).forEach((beer) => {
    const missing = [];
    requiredFields.forEach((field) => {
      if (!beer[field] && beer[field] !== 0) {
        missing.push(field);
      }
    });

    if (missing.length) {
      const missingStr = missing.join(', ');
      if (beer.name) {
        error(`The beer ${beer.name} has some missing fields: ${missingStr}`);
      } else {
        error(`A beer has some missing fields: ${missingStr}`);
      }
    }
  });

  Object.keys(newBeers).forEach((id) => {
    const currentBeer = currentBeers[id] || {};
    validatedBeers[id] = {
      index: 0,
      active: true,
      created: timestamp,
      ...currentBeer,
      ...newBeers[id],
      id,
    };

    if (!compareObjects(validatedBeers[id], currentBeer)) {
      validatedBeers[id].lastUpdate = timestamp;
    }
  });

  if (!isBlind) {
    const indices = {};
    Object.values(validatedBeers).forEach((beer) => {
      if (indices[beer.index]) {
        error('Beer indices must be unique');
      }
      indices[beer.index] = true;
    });
  }

  return validatedBeers;
}

// https://stackoverflow.com/a/5859028
function compareObjects(o1, o2) {
  for (const p in o1) {
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (const p in o2) {
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
}

function error(message) {
  console.log(message);
  process.exit(1);
}

module.exports = {
  createRoom,
  getCurrentRoom,
  updateRoom,
  downloadBeers,
};
