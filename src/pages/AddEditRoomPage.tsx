import React, { useState } from 'react';
import { Typography, useTheme } from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory, RouteComponentProps } from 'react-router-dom';

import Layout from '../components/Layout';
import RoomForm, { IValues as IRoomValues } from '../components/RoomForm';
import EditBeers from '../components/EditBeers';
import { IValues as IBeerValues } from '../components/EditBeerModal';
import Alert from '../components/Alert';
import useRoom from '../hooks/useRoom';

const AddEditRoomPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const history = useHistory();
  const theme = useTheme();
  const { room, beers } = useRoom(match.params.code);

  const [notifierError, setNotifierError] = useState('');
  const [codeExistsError, setCodeExistsError] = useState(false);

  const editing = !!match.params.code;
  const loading = editing && !room;

  return (
    <Layout loading={loading}>
      <Typography variant="h2">{room ? room.title : 'Ný smökkun'}</Typography>

      {room?.hasStarted ? (
        <Typography
          color="primary"
          variant="h5"
          style={{ marginTop: theme.spacing(3) }}
        >
          Ekki er hægt að breyta smökkun eftir að hún er byrjuð
        </Typography>
      ) : (
        <>
          <div style={{ marginTop: theme.spacing(5) }}>
            <RoomForm
              room={room}
              editing={editing}
              codeExistsError={codeExistsError}
              createRoom={createRoom}
              updateRoom={updateRoom}
            />
          </div>
          {editing && (
            <div style={{ marginTop: theme.spacing(5) }}>
              <EditBeers
                beers={beers}
                createBeer={createBeer}
                updateBeer={updateBeer}
              />
            </div>
          )}
        </>
      )}

      <Alert
        open={!!notifierError}
        message={notifierError}
        severity="error"
        onClose={() => setNotifierError('')}
      />
    </Layout>
  );

  // TODO: Move all firebase calls to service
  async function createRoom(values: IRoomValues) {
    setNotifierError('');
    setCodeExistsError(false);

    await firebase
      .database()
      .ref(`rooms/${values.code}`)
      .once('value', async (snapshot) => {
        if (snapshot.exists()) {
          setCodeExistsError(true);
        } else {
          await updateRoom(values);
          history.push(`/${values.code}/edit`);
        }
      })
      .catch(() => {
        setNotifierError('Villa kom upp við að búa til smökkun');
      });
  }

  async function updateRoom(values: IRoomValues) {
    setNotifierError('');
    const timestamp = Date.now();

    await firebase
      .database()
      .ref(`rooms/${values.code}`)
      .set({
        hasStarted: false,
        created: timestamp,
        code: values.code,
        ...(room || {}),
        title: values.title,
        isBlind: values.isBlind,
        lastUpdate: timestamp,
      })
      .catch(() => {
        setNotifierError('Villa kom upp við að uppfæra smökkun');
      });
  }

  async function createBeer(values: IBeerValues) {
    setNotifierError('');

    if (room) {
      const beerRef = await firebase
        .database()
        .ref(`rooms/${room.code}/beers`)
        .push({ active: false });

      if (beerRef.key) {
        await updateBeer(values, beerRef.key);
      } else {
        setNotifierError('Villa kom upp við að búa til bjór');
      }
    }
  }

  async function updateBeer(values: IBeerValues, beerId: string) {
    setNotifierError('');
    const timestamp = Date.now();
    const currentBeer =
      room?.beers && room.beers[beerId] ? room.beers[beerId] : {};

    if (room) {
      await firebase
        .database()
        .ref(`rooms/${room.code}/beers/${beerId}`)
        .set({
          index: values.index,
          created: timestamp,
          ...currentBeer,
          id: beerId,
          name: values.name,
          type: values.type,
          abv: values.abv,
          active: values.active,
          brewer: values.brewer,
          country: values.country,
          description: values.description,
          lastUpdate: timestamp,
        })
        .catch(() => {
          setNotifierError('Villa kom upp við að uppfæra bjór');
        });
    }
  }
};

export default AddEditRoomPage;
