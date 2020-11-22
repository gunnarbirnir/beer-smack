import React from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import cx from 'classnames';

import { IUser } from '../interfaces';

interface IProps {
  roomTitle: string;
  beerCount: number;
  currentUserId: string;
  users: IUser[];
}

const useStyles = makeStyles((theme) => ({
  userList: {
    marginTop: theme.spacing(2),
  },
  userItem: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
  currentUser: {
    backgroundColor: theme.palette.secondary.light,
  },
  statusText: {
    marginBottom: theme.spacing(2),
  },
}));

const HasNotStarted: React.FC<IProps> = ({
  roomTitle,
  beerCount,
  currentUserId,
  users,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        {roomTitle}
      </Typography>
      <Typography color="primary" variant="h5" className={classes.statusText}>
        Smökkunin er ekki byrjuð
      </Typography>
      <Typography color="textSecondary">
        {beerCount} bjórar á dagskrá
      </Typography>
      <Typography color="textSecondary">
        {users.length} {users.length === 1 ? 'þátttakandi' : 'þátttakendur'}
      </Typography>
      <Grid container direction="column" className={classes.userList}>
        {users.map((user) => (
          <Typography
            key={user.id}
            className={cx(classes.userItem, {
              [classes.currentUser]: user.id === currentUserId,
            })}
          >
            {user.name}
          </Typography>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default HasNotStarted;
