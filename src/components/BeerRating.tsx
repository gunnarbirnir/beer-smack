import React, { useState, useEffect } from 'react';
import {
  Typography,
  makeStyles,
  TextField,
  Button,
  Grid,
  useTheme,
} from '@material-ui/core';
import firebase from 'firebase/app';
import NumberFormat from 'react-number-format';

import InfoItem from './InfoItem';
import { IBeer } from '../interfaces';
import { CONTENT_WIDTH } from '../constants';

interface IProps {
  roomCode: string;
  currentBeer: IBeer;
  currentUserId: string;
  currentRating: number | null;
  activeBeerIndex: number | null;
  selectedBeerIndex: number;
  setSelectedBeerIndex: (index: number) => void;
}

interface RatingNumberFormatProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  nextPrevButtons: {
    marginTop: theme.spacing(4),
  },
}));

const BeerRating: React.FC<IProps> = ({
  roomCode,
  currentBeer,
  currentUserId,
  currentRating,
  activeBeerIndex,
  selectedBeerIndex,
  setSelectedBeerIndex,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [ratingInput, setRatingInput] = useState('');
  const [updatingRating, setUpdatingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const currentRatingInput = getValueOfRatingInput();

  useEffect(() => {
    setRatingInput('');
  }, [selectedBeerIndex]);

  return (
    <React.Fragment>
      <Typography
        variant="caption"
        color="primary"
        style={{ textTransform: 'uppercase' }}
      >
        Nr {currentBeer.index + 1}
      </Typography>
      <Typography variant="h2" gutterBottom>
        {currentBeer.name}
      </Typography>
      <InfoItem label="Tegund" text={currentBeer.type} />
      <InfoItem label="Styrkleiki" text={`${currentBeer.abv}%`} />
      <InfoItem label="Framleiðandi" text={currentBeer.brewer} />
      <InfoItem label="Land" text={currentBeer.country} />
      <InfoItem label="Lýsing" text={currentBeer.description} />
      {renderForm()}
      {currentRating !== null && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: theme.spacing(1) }}
        >
          Einkunn hefur verið skráð: {currentRating.toFixed(1)}
        </Typography>
      )}
      {ratingError && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.error}
        >
          {ratingError}
        </Typography>
      )}
      {renderNextPrevButtons()}
    </React.Fragment>
  );

  function renderForm() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateBeerRating(currentUserId, currentBeer.id);
        }}
      >
        <Grid container direction="column">
          <TextField
            fullWidth
            value={ratingInput}
            variant="outlined"
            label="Einkunn"
            autoFocus
            style={{ maxWidth: CONTENT_WIDTH / 2 }}
            className={classes.input}
            disabled={updatingRating}
            onChange={(e) => setRatingInput(e.target.value)}
            InputProps={{
              inputComponent: RatingNumberFormat as any,
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              !ratingInput ||
              updatingRating ||
              currentRating === currentRatingInput
            }
            type="submit"
            style={{ maxWidth: CONTENT_WIDTH / 2 }}
          >
            {currentRating !== null ? 'Uppfæra' : 'Staðfesta'}
          </Button>
        </Grid>
      </form>
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
          color="secondary"
          disabled={selectedBeerIndex <= 0}
          onClick={() => setSelectedBeerIndex(selectedBeerIndex - 1)}
        >
          Fyrri
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!activeBeerIndex || selectedBeerIndex >= activeBeerIndex}
          onClick={() => setSelectedBeerIndex(selectedBeerIndex + 1)}
        >
          Næsti
        </Button>
      </Grid>
    );
  }

  function RatingNumberFormat(props: RatingNumberFormatProps) {
    const { inputRef, onChange, ...other } = props;
    const formatInput = (val: string) => {
      if (val === '100' || val === '1000') {
        return '10.0';
      }
      if (val.length === 0) {
        return '';
      }
      if (val.length === 1) {
        return val;
      }
      return `${val.substr(0, 1)}.${val.substr(1, 1)}`;
    };

    return (
      <NumberFormat
        {...other}
        isNumericString
        getInputRef={inputRef}
        format={formatInput}
        placeholder="_._"
        onValueChange={(values) => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
      />
    );
  }

  function updateBeerRating(userId: string, beerId: string) {
    setUpdatingRating(true);

    firebase
      .database()
      .ref(`rooms/${roomCode}/users/${userId}/ratings/${beerId}`)
      .set(currentRatingInput)
      .then(() => {
        setUpdatingRating(false);
        setRatingInput('');
        setRatingError('');
      })
      .catch(() => {
        setRatingError('Tókst ekki að uppfæra einkunn');
        setUpdatingRating(false);
      });
  }

  function getValueOfRatingInput() {
    const leadingZero = ratingInput[0] === '0';
    const ratingValue = parseInt(ratingInput);

    return ratingValue < 10
      ? ratingValue / (leadingZero ? 10 : 1)
      : ratingValue / 10;
  }
};

export default BeerRating;
