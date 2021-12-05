import React, { useState } from 'react';
import { useTheme, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory, RouteComponentProps } from 'react-router-dom';

import Layout from '../components/Layout';
import RoomForm, { IValues } from '../components/RoomForm';
import Alert from '../components/Alert';
import useRoom from '../hooks/useRoom';

const AddEditRoomPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { room } = useRoom(match.params.code);

  const [notifierError, setNotifierError] = useState('');
  const [codeExistsError, setCodeExistsError] = useState(false);

  const editing = !!match.params.code;
  const loading = editing && !room;

  return (
    <Layout loading={loading}>
      <Typography variant="h2">{room ? room.title : 'Ný smökkun'}</Typography>
      <div style={{ marginTop: theme.spacing(4) }}>
        <RoomForm
          room={room}
          editing={editing}
          codeExistsError={codeExistsError}
          createRoom={createRoom}
          updateRoom={updateRoom}
        />
      </div>
      <Alert
        open={!!notifierError}
        message={notifierError}
        severity="error"
        onClose={() => setNotifierError('')}
      />
    </Layout>
  );

  // TODO: Move all firebase calls to service
  async function createRoom(values: IValues) {
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
        setNotifierError('Villa kom upp');
      });
  }

  async function updateRoom(values: IValues) {
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
        setNotifierError('Villa kom upp');
      });
  }
};

export default AddEditRoomPage;
