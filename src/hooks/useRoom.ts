import { useState, useEffect } from 'react';
import firebase from 'firebase/app';

import { IRoom, IBeer, IUser } from '../interfaces';

function useRoom(roomCode: string) {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<IRoom | null>(null);
  const beers: IBeer[] = room ? Object.values(room.beers) : [];
  const users: IUser[] = room ? Object.values(room.users) : [];

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

  return { room, loading, beers, users };
}

export default useRoom;
