import React, { useState } from 'react';
import { Typography, useTheme } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem';
import Alert from '../components/Alert';
import { IUser } from '../interfaces';

const UserPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const theme = useTheme();
  const { room, loading, users } = useRoom(match.params.code);
  const [notifierOpen, setNotifierOpen] = useState(false);

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      {renderContent()}
      <Alert
        open={notifierOpen}
        message="Slóð afrituð"
        onClose={() => setNotifierOpen(false)}
        severity="success"
      />
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
};

export default UserPage;
