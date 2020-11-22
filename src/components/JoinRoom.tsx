import React, { useState } from 'react';
import {
  Typography,
  makeStyles,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';
import firebase from 'firebase/app';
import shortid from 'shortid';

import { CONTENT_WIDTH } from '../constants';

interface IProps {
  roomTitle: string;
  roomCode: string;
  setCurrentUserId: (id: string) => void;
}

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
}));

const JoinRoom: React.FC<IProps> = ({
  roomTitle,
  roomCode,
  setCurrentUserId,
}) => {
  const classes = useStyles();
  const [nameInput, setNameInput] = useState('');
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [joinError, setJoinError] = useState('');

  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        {roomTitle}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinRoom();
        }}
      >
        <Grid container direction="column">
          <TextField
            fullWidth
            value={nameInput}
            variant="outlined"
            label="Nafn"
            autoFocus
            style={{ maxWidth: CONTENT_WIDTH / 2 }}
            className={classes.input}
            disabled={joiningRoom}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={!nameInput || joiningRoom}
            type="submit"
            style={{ maxWidth: CONTENT_WIDTH / 2 }}
          >
            Innskrá
          </Button>
        </Grid>
      </form>
      {joinError && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.error}
        >
          {joinError}
        </Typography>
      )}
    </React.Fragment>
  );

  function joinRoom() {
    setJoiningRoom(true);
    const newUserId = shortid.generate();
    const newUser = {
      id: newUserId,
      name: nameInput,
      timestamp: Date.now(),
    };

    firebase
      .database()
      .ref(`rooms/${roomCode}/users/${newUserId}`)
      .set(newUser)
      .then(() => {
        setCurrentUserId(newUserId);
        setJoiningRoom(false);
        setJoinError('');
        localStorage.setItem('userId', newUserId);
      })
      .catch(() => {
        setJoinError('Tókst ekki að búa til notanda');
        setJoiningRoom(false);
      });
  }
};

export default JoinRoom;
