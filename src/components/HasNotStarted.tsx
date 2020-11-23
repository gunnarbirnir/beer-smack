import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

import { IUser } from '../interfaces';
import ListItem from './ListItem';

interface IProps {
  roomTitle: string;
  beerCount: number;
  currentUserId: string;
  users: IUser[];
}

const useStyles = makeStyles((theme) => ({
  userList: {
    marginTop: theme.spacing(3),
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
        {users.length} {users.length === 1 ? 'þátttakandi:' : 'þátttakendur:'}
      </Typography>
      <div className={classes.userList}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            mainText={user.name}
            highlighted={user.id === currentUserId}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default HasNotStarted;
