import React, { useState } from 'react';
import { useTheme, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

import Layout from '../components/Layout';
import RoomForm, { IValues } from '../components/RoomForm';
import Alert from '../components/Alert';

const AddEditRoomPage: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();

  const [notifierError, setNotifierError] = useState('');
  const [codeExistsError, setCodeExistsError] = useState(false);

  return (
    <Layout>
      <Typography variant="h2">Ný smökkun</Typography>
      <div style={{ marginTop: theme.spacing(4) }}>
        <RoomForm codeExistsError={codeExistsError} createRoom={createRoom} />
      </div>
      <Alert
        open={!!notifierError}
        message={notifierError}
        severity="error"
        onClose={() => setNotifierError('')}
      />
    </Layout>
  );

  function createRoom(values: IValues) {
    setNotifierError('');
    setCodeExistsError(false);

    return new Promise((resolve) => {
      firebase
        .database()
        .ref(`rooms/${values.code}`)
        .once('value', async (snapshot) => {
          if (snapshot.exists()) {
            setCodeExistsError(true);
            resolve(null);
          } else {
            await updateRoom(values);
            history.push(`/${values.code}/admin`);
          }
        })
        .catch(() => {
          setNotifierError('Villa kom upp');
          resolve(null);
        });
    });
  }

  function updateRoom(values: IValues) {
    setNotifierError('');

    return new Promise((resolve) => {
      firebase
        .database()
        .ref(`rooms/${values.code}`)
        .set({
          code: values.code,
          title: values.title,
          isBlind: values.isBlind,
          hasStarted: false,
        })
        .then(() => {
          resolve(null);
        })
        .catch(() => {
          setNotifierError('Villa kom upp');
          resolve(null);
        });
    });
  }
};

export default AddEditRoomPage;
