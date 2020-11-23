import { useState, useEffect } from 'react';
import firebase from 'firebase/app';

import { IRoom, IBeer, IUser } from '../interfaces';

function useRoom(roomCode: string) {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [loading, setLoading] = useState(true);

  const beers: IBeer[] =
    room && room.beers
      ? Object.values(room.beers)
          .filter((b) => b.active)
          .sort(sortBeers)
      : [];
  const users: IUser[] =
    room && room.users ? Object.values(room.users).sort(sortUsers) : [];
  const activeBeerIndex =
    room && room.hasStarted
      ? getActiveBeerIndex(beers, room.finished || {})
      : null;

  useEffect(() => {
    const path = `rooms/${roomCode}`;
    const listener = firebase
      .database()
      .ref(path)
      .on('value', (snapshot) => {
        setRoom(snapshot.val());
        setLoading(false);
      });

    return () => firebase.database().ref(path).off('value', listener);
  }, [roomCode]);

  return { room, loading, beers, users, activeBeerIndex };
}

function sortBeers(a: IBeer, b: IBeer) {
  return a.index - b.index;
}

function sortUsers(a: IUser, b: IUser) {
  return a.timestamp - b.timestamp;
}

function getActiveBeerIndex(
  beers: IBeer[],
  finished: { [beerId: string]: boolean }
) {
  let index = 0;
  for (const beer of beers) {
    if (!finished[beer.id]) {
      return index;
    }
    index++;
  }
  return null;
}

export default useRoom;
