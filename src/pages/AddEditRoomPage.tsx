import React, { useState } from 'react';
import { Typography, useTheme } from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory, RouteComponentProps } from 'react-router-dom';

import Layout from '../components/Layout';
import RoomForm from '../components/RoomForm';
import EditBeers from '../components/EditBeers';
import Alert from '../components/Alert';
import useRoom from '../hooks/useRoom';
import { IRoomValues, IBeerValues } from '../interfaces/forms';

const AddEditRoomPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const history = useHistory();
  const theme = useTheme();
  const { room, beers } = useRoom(match.params.code);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotifierOpen, setSuccessNotifierOpen] = useState(false);
  const [errorNotifierOpen, setErrorNotifierOpen] = useState(false);
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
        open={successNotifierOpen}
        message={successMessage}
        severity="success"
        onClose={() => setSuccessNotifierOpen(false)}
      />
      <Alert
        open={errorNotifierOpen}
        message={errorMessage}
        severity="error"
        onClose={() => setErrorNotifierOpen(false)}
      />
    </Layout>
  );

  function setNotifierSuccess(message: string) {
    setSuccessMessage(message);
    setSuccessNotifierOpen(true);
  }

  function setNotifierError(message: string) {
    setErrorMessage(message);
    setErrorNotifierOpen(true);
  }

  function resetFeedback() {
    setSuccessNotifierOpen(false);
    setErrorNotifierOpen(false);
    setCodeExistsError(false);
  }

  // TODO: Move all firebase calls to service
  // TODO: Update database rules
  async function createRoom(values: IRoomValues) {
    resetFeedback();

    await firebase
      .database()
      .ref(`rooms/${values.code}`)
      .once('value', async (snapshot) => {
        if (snapshot.exists()) {
          setCodeExistsError(true);
        } else {
          await updateRoom(values);
          setNotifierSuccess('Smökkun búin til');
          history.push(`/${values.code}/edit`);
        }
      })
      .catch(() => {
        setNotifierError('Villa kom upp við að búa til smökkun');
      });
  }

  async function updateRoom(values: IRoomValues) {
    resetFeedback();
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
      .then(() => {
        setNotifierSuccess('Smökkun uppfærð');
      })
      .catch(() => {
        setNotifierError('Villa kom upp við að uppfæra smökkun');
      });
  }

  async function createBeer(values: IBeerValues) {
    resetFeedback();

    if (room) {
      const beerRef = await firebase
        .database()
        .ref(`rooms/${room.code}/beers`)
        .push({ active: false });

      if (beerRef.key) {
        await updateBeer(values, beerRef.key);
        setNotifierSuccess('Bjór bætt við');
      } else {
        setNotifierError('Villa kom upp við að búa til bjór');
      }
    }
  }

  async function updateBeer(values: IBeerValues, beerId: string) {
    resetFeedback();

    if (room) {
      const timestamp = Date.now();
      const currentBeer =
        room.beers && room.beers[beerId] ? room.beers[beerId] : null;
      const beerAtIndex = beers[values.index];
      let indexPromise;

      if (beerAtIndex && beerAtIndex.id !== beerId) {
        const currentIndex = currentBeer ? currentBeer.index : beers.length;
        const indexChange = currentIndex > beerAtIndex.index ? 1 : -1;

        indexPromise = firebase
          .database()
          .ref(`rooms/${room.code}/beers/${beerAtIndex.id}`)
          .set({
            ...beerAtIndex,
            index: beerAtIndex.index + indexChange,
          });
      }

      const updatePromise = firebase
        .database()
        .ref(`rooms/${room.code}/beers/${beerId}`)
        .set({
          index: values.index,
          created: timestamp,
          ...(currentBeer || {}),
          id: beerId,
          name: values.name,
          type: values.type,
          abv: values.abv,
          active: values.active,
          brewer: values.brewer,
          country: values.country,
          description: values.description,
          lastUpdate: timestamp,
        });

      await Promise.all([indexPromise, updatePromise])
        .then(() => {
          setNotifierSuccess('Bjór uppfærður');
        })
        .catch(() => {
          setNotifierError('Villa kom upp við að uppfæra bjór');
        });
    }
  }
};

export default AddEditRoomPage;
