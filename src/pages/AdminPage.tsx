import React, { useState } from 'react';
import { Typography, makeStyles, Button, Grid } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import firebase from 'firebase/app';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem';
import { CONTENT_WIDTH } from '../constants';

const useStyles = makeStyles((theme) => ({
  statusText: {
    marginBottom: theme.spacing(3),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  nextPrevButtons: {
    marginTop: theme.spacing(3),
  },
  beerList: {
    marginTop: theme.spacing(3),
  },
}));

const AdminPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const classes = useStyles();
  const { room, loading, activeBeerIndex, beers } = useRoom(match.params.code);
  const [loadingStateChange, setLoadingStateChange] = useState(false);
  const [stateChangeError, setStateChangeError] = useState('');

  const activeBeer = activeBeerIndex !== null ? beers[activeBeerIndex] : null;
  const previousBeer =
    activeBeerIndex === null
      ? room && room.hasStarted
        ? beers[beers.length - 1]
        : null
      : beers[activeBeerIndex - 1];

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      {renderContent()}
      {stateChangeError && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.error}
        >
          {stateChangeError}
        </Typography>
      )}
    </Layout>
  );

  function renderContent() {
    if (!room) {
      return null;
    }

    if (!room.hasStarted) {
      return (
        <React.Fragment>
          <Typography variant="h2" gutterBottom>
            {room.title}
          </Typography>
          <Typography
            color="primary"
            variant="h5"
            className={classes.statusText}
          >
            Smökkunin er ekki byrjuð
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={loadingStateChange}
            style={{ maxWidth: CONTENT_WIDTH / 2 }}
            onClick={() => startStopTasting(true)}
          >
            Byrja
          </Button>
        </React.Fragment>
      );
    }

    if (!activeBeer) {
      return (
        <React.Fragment>
          <Typography variant="h2" gutterBottom>
            {room.title}
          </Typography>
          <Typography
            color="primary"
            variant="h5"
            className={classes.statusText}
          >
            Smökkun lokið
          </Typography>
          {renderNextPrevButtons()}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Typography variant="h2" gutterBottom>
          {room.isBlind
            ? `${activeBeer.index + 1}. ${activeBeer.name}`
            : activeBeer.name}
        </Typography>
        {renderNextPrevButtons()}
        <div className={classes.beerList}>
          {beers.map((beer, index) => (
            <ListItem
              key={beer.id}
              mainText={beer.name}
              highlighted={index === activeBeerIndex}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }

  function renderNextPrevButtons() {
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        className={classes.nextPrevButtons}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={loadingStateChange}
          onClick={
            previousBeer
              ? () => nextPrevBeer(previousBeer.id, false)
              : () => startStopTasting(false)
          }
        >
          Fyrri
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!activeBeer || loadingStateChange}
          onClick={() => activeBeer && nextPrevBeer(activeBeer.id, true)}
        >
          {activeBeerIndex === beers.length - 1 ? 'Ljúka smökkun' : 'Næsti'}
        </Button>
      </Grid>
    );
  }

  function getBlindIndex() {
    const indexes = beers.map((_, index) => index);
    const blindIndex: { [id: string]: number } = {};

    beers.forEach((beer) => {
      const nextIndex = Math.floor(Math.random() * indexes.length);
      blindIndex[beer.id] = indexes.splice(nextIndex, 1)[0];
    });

    return blindIndex;
  }

  function startStopTasting(start: boolean) {
    setLoadingStateChange(true);

    if (room?.isBlind && start) {
      firebase
        .database()
        .ref(`rooms/${match.params.code}/blindIndex`)
        .set(getBlindIndex())
        .then(() => {
          setStartStop(start);
        })
        .catch(() => {
          setLoadingStateChange(false);
          setStateChangeError('Villa kom upp');
        });
    } else {
      setStartStop(start);
    }
  }

  function setStartStop(start: boolean) {
    firebase
      .database()
      .ref(`rooms/${match.params.code}/hasStarted`)
      .set(start)
      .then(() => {
        setLoadingStateChange(false);
        setStateChangeError('');
      })
      .catch(() => {
        setLoadingStateChange(false);
        setStateChangeError('Villa kom upp');
      });
  }

  function nextPrevBeer(beerId: string, next: boolean) {
    setLoadingStateChange(true);

    firebase
      .database()
      .ref(`rooms/${match.params.code}/finished/${beerId}`)
      .set(next)
      .then(() => {
        setLoadingStateChange(false);
        setStateChangeError('');
      })
      .catch(() => {
        setLoadingStateChange(false);
        setStateChangeError('Villa kom upp');
      });
  }
};

export default AdminPage;
