import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

import { IRating, IBeer } from '../interfaces';
import InfoItem from './InfoItem';
import ListItem from './ListItem';

interface IProps {
  roomTitle: string;
  userRatings?: IRating;
  roomBeers: { [id: string]: IBeer } | null;
}

const useStyles = makeStyles((theme) => ({
  statusText: {
    marginBottom: theme.spacing(2),
  },
  ratingList: {
    marginTop: theme.spacing(3),
  },
}));

const HasEnded: React.FC<IProps> = ({ roomTitle, userRatings, roomBeers }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        {roomTitle}
      </Typography>
      <Typography color="primary" variant="h5" className={classes.statusText}>
        Smökkun lokið
      </Typography>
      {userRatings && roomBeers && (
        <React.Fragment>
          <InfoItem
            label="Þín meðaleinkunn"
            text={getUserAvgRating(userRatings)}
            gutterBottom={false}
          />
          <Typography color="textSecondary">Þínar einkunnir:</Typography>
          <div className={classes.ratingList}>
            {Object.keys(userRatings)
              .sort((a, b) => userRatings[b] - userRatings[a])
              .map((beerId, index) => (
                <ListItem
                  key={beerId}
                  highlighted={index === 0}
                  mainText={`${index + 1}. ${roomBeers[beerId].name}`}
                  secondaryText={userRatings[beerId].toFixed(1)}
                />
              ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  function getUserAvgRating(ratings: IRating) {
    let total = 0;
    const ratingsList = Object.values(ratings);
    ratingsList.forEach((rating) => (total += rating));
    return (total / ratingsList.length).toFixed(2);
  }

  /* function getUserFavoriteBeer(ratings: IRating) {
    let highest = 0;
    let favorite = '';

    Object.keys(ratings).forEach((beerId) => {
      if (ratings[beerId] > highest) {
        highest = ratings[beerId];
        favorite = roomBeers
          ? `${roomBeers[beerId].name} (${highest.toFixed(1)})`
          : '';
      }
    });
    return favorite;
  }

  function getUserLeastFavoriteBeer(ratings: IRating) {
    let lowest = RATING_MAX + 1;
    let leastFavorite = '';

    Object.keys(ratings).forEach((beerId) => {
      if (ratings[beerId] < lowest) {
        lowest = ratings[beerId];
        leastFavorite = roomBeers
          ? `${roomBeers[beerId].name} (${lowest.toFixed(1)})`
          : '';
      }
    });
    return leastFavorite;
  } */
};

export default HasEnded;
