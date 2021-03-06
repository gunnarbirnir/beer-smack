import React from 'react';
import { Typography, makeStyles, Grid, useTheme } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';
import ListItem from '../components/ListItem';
import { IBeer } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: 1200,
    padding: '50px 100px',
    margin: '0px auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  statusText: {
    textAlign: 'center',
    margin: theme.spacing(0, 1),
  },
}));

const StatusPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { room, loading, beers, users, activeBeerIndex, beerRatings } = useRoom(
    match.params.code
  );
  const activeBeer = activeBeerIndex !== null ? beers[activeBeerIndex] : null;
  const isBlind = !!room?.isBlind;

  return (
    <Layout
      loading={loading}
      error={!room ? 'Room not found' : undefined}
      fullWidth={true}
      padding={false}
    >
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        className={classes.container}
      >
        {renderContent()}
      </Grid>
    </Layout>
  );

  function renderContent() {
    if (!room) {
      return null;
    }

    if (!room.hasStarted) {
      return renderHasNotStarted(room.title);
    }

    if (!activeBeer) {
      return renderHasEnded(room.title);
    }

    return renderBeerView(activeBeer);
  }

  function renderHasNotStarted(roomTitle: string) {
    return (
      <React.Fragment>
        <Typography variant="h1" className={classes.title}>
          {roomTitle}
        </Typography>
        {renderStatusText([
          `${beers.length} bjórar`,
          `${users.length} ${
            users.length === 1 ? 'þátttakandi' : 'þátttakendur'
          }`,
        ])}
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid key={user.id} item xs={12} sm={6}>
              <ListItem large mainText={user.name} padding={false} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }

  function renderHasEnded(roomTitle: string) {
    const filteredBeers = beers
      .filter((b) => !!beerRatings[b.id] || beerRatings[b.id] === 0)
      .sort((a, b) => beerRatings[b.id] - beerRatings[a.id]);
    const isEven = filteredBeers.length % 2 === 0;

    return (
      <React.Fragment>
        <Typography variant="h1" className={classes.title}>
          {roomTitle}
        </Typography>
        <Grid container spacing={2} style={{ marginTop: theme.spacing(2) }}>
          {filteredBeers.map((beer, index) => (
            <Grid
              item
              key={beer.id}
              xs={12}
              sm={index === 0 || (isEven && index === 1) ? 12 : 6}
            >
              <ListItem
                large
                padding={false}
                highlighted={index === 0}
                mainText={`${index + 1}. ${beer.name} ${
                  isBlind ? `(Bjór ${beer.index + 1})` : ''
                }`}
                secondaryText={
                  beerRatings[beer.id] !== undefined
                    ? beerRatings[beer.id].toFixed(2).toString()
                    : undefined
                }
              />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }

  function renderBeerView(currentBeer: IBeer) {
    return (
      <React.Fragment>
        <Typography
          variant="h1"
          className={classes.title}
          style={{ marginBottom: isBlind ? theme.spacing(5) : undefined }}
        >
          {isBlind ? `Bjór ${currentBeer.index + 1}` : currentBeer.name}
        </Typography>
        {!isBlind &&
          renderStatusText([
            currentBeer.type,
            `${currentBeer.abv.toFixed(1)}%`,
            currentBeer.brewer,
          ])}
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid key={user.id} item xs={12} sm={6}>
              <ListItem
                large
                padding={false}
                mainText={user.name}
                highlighted={
                  !!user.ratings && user.ratings[currentBeer.id] !== undefined
                }
              />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }

  function renderStatusText(items: string[]) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ marginBottom: theme.spacing(6) }}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Typography
              variant="h3"
              color="primary"
              className={classes.statusText}
            >
              {item}
            </Typography>
            {index !== items.length - 1 && (
              <Typography
                color="primary"
                className={classes.statusText}
                style={{ fontSize: 28 }}
              >
                |
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Grid>
    );
  }
};

export default StatusPage;
