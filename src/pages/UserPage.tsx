import React, { useState } from 'react';
import {
  Typography,
  useTheme,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { RouteComponentProps } from 'react-router-dom';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem';
import { IUser } from '../interfaces';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UserPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const theme = useTheme();
  const { room, loading, users } = useRoom(match.params.code);
  const [notifierOpen, setNotifierOpen] = useState(false);

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      {renderContent()}
      <Snackbar
        open={notifierOpen}
        autoHideDuration={3000}
        onClose={handleCloseNotifier}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        style={{ marginBottom: theme.spacing(3) }}
      >
        <Alert onClose={handleCloseNotifier} severity="success">
          Slóð afrituð
        </Alert>
      </Snackbar>
    </Layout>
  );

  function renderContent() {
    if (!room) {
      return null;
    }

    return (
      <React.Fragment>
        <Typography variant="h2" gutterBottom>
          Þátttakendur
        </Typography>
        <Typography
          color="textSecondary"
          style={{ marginBottom: theme.spacing(4) }}
        >
          {users.length
            ? 'Ýttu á notanda til að afrita slóðina hans'
            : 'Engir þátttakendur'}
        </Typography>
        {users.map((user) => (
          <ListItem
            key={user.id}
            mainText={user.name}
            onClick={() => copyURL(user)}
          />
        ))}
      </React.Fragment>
    );
  }

  function copyURL(user: IUser) {
    navigator.clipboard.writeText(
      window.location.href.replace('/users', `?user=${user.id}`)
    );
    setNotifierOpen(true);
  }

  function handleCloseNotifier(
    event: React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) {
    if (reason === 'clickaway') {
      return;
    }

    setNotifierOpen(false);
  }
};

export default UserPage;
