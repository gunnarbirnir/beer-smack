import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';

const useStyles = makeStyles((theme) => ({}));

const StatusPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const classes = useStyles();
  const { room, loading } = useRoom(match.params.code);

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      <Typography variant="h2">Status</Typography>
    </Layout>
  );
};

export default StatusPage;
