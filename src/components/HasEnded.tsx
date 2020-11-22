import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

import { IRating, IBeer } from '../interfaces';
import { RATING_MAX } from '../constants';
import InfoItem from './InfoItem';

interface IProps {
  roomTitle: string;
  userRatings?: IRating;
  roomBeers: { [id: string]: IBeer } | null;
}

const useStyles = makeStyles((theme) => ({
  statusText: {
    marginBottom: theme.spacing(2),
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
      {userRatings && (
        <React.Fragment>
          <InfoItem
            label="Þín meðaleinkunn"
            text={getUserAvgRating(userRatings)}
          />
          <InfoItem
            label="Uppáhalds bjór"
            text={getUserFavoriteBeer(userRatings)}
          />
          <InfoItem
            label="Versti bjór"
            text={getUserLeastFavoriteBeer(userRatings)}
          />
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

  function getUserFavoriteBeer(ratings: IRating) {
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
  }
};

export default HasEnded;
