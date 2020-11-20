import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';

const useStyles = makeStyles((theme) => ({}));

const RatingPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const classes = useStyles();
  const { room, loading, beers, users } = useRoom(match.params.code);

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      {room && (
        <React.Fragment>
          <Typography variant="h1">{room.title}</Typography>
          <br />
          <Typography>Bjórar: {beers.length}</Typography>
          <Typography>Þátttakendur: {users.length}</Typography>
        </React.Fragment>
      )}
    </Layout>
  );
};

export default RatingPage;
