import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { Rating } from 'react-simple-star-rating';

import InfoItem from './InfoItem';
import { IBeer, IUser } from '../interfaces';
import { CONTENT_WIDTH } from '../constants';
import useObjectSize from '../hooks/useObjectSize';

interface IProps {
  isBlind: boolean;
  roomCode: string;
  beerCount: number;
  currentBeer: IBeer;
  currentUser: IUser;
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
  statusItem: {
    padding: '4px 8px',
    backgroundColor: theme.palette.grey[300],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  error: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  starRatingContainer: {
    marginTop: theme.spacing(2),
  },
  nextPrevButtons: {
    marginTop: theme.spacing(4),
  },
}));

const BeerRating: React.FC<IProps> = ({
  isBlind,
  roomCode,
  beerCount,
  currentBeer,
  currentUser,
  currentRating,
  activeBeerIndex,
  selectedBeerIndex,
  setSelectedBeerIndex,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const starContainerRef = useRef(null);
  const { width: starContainerWidth } = useObjectSize(starContainerRef);

  const [ratingInput, setRatingInput] = useState('');
  const [starRatingValue, setStarRatingValue] = useState(0);
  const [updatingRating, setUpdatingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const currentRatingInput = getValueOfRatingInput();

  useEffect(() => {
    setRatingInput('');
  }, [selectedBeerIndex]);

  useEffect(() => {
    // Rating component has a scale of 0-100
    const starRating = (currentRating || 0) * 10;
    setStarRatingValue(starRating);
  }, [currentRating]);

  const starWidth = useMemo(() => {
    // Set max width and divide available space
    return Math.min(starContainerWidth, 450) / 10;
  }, [starContainerWidth]);

  return (
    <React.Fragment>
      {renderStatus()}
      {/* <Typography
        variant="caption"
        color="primary"
        style={{ textTransform: 'uppercase' }}
      >
        Nr {currentBeer.index + 1}
      </Typography> */}
      <Typography variant="h2" style={{ marginBottom: theme.spacing(3) }}>
        {isBlind ? `Bjór ${currentBeer.index + 1}` : currentBeer.name}
      </Typography>
      {!isBlind && (
        <>
          <InfoItem label="Tegund" text={currentBeer.type} />
          <InfoItem
            label="Styrkleiki"
            text={`${currentBeer.abv.toFixed(1)}%`}
          />
          <InfoItem label="Framleiðandi" text={currentBeer.brewer} />
          <InfoItem label="Land" text={currentBeer.country} />
          <InfoItem label="Lýsing" text={currentBeer.description} />
        </>
      )}
      {/* renderForm() */}
      {renderStarRating()}
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

  function renderStatus() {
    return (
      <Grid container direction="row" justify="flex-start">
        <Typography
          variant="caption"
          className={classes.statusItem}
          style={{ backgroundColor: theme.palette.secondary.light }}
        >
          {currentBeer.index + 1} / {beerCount.toString()}
        </Typography>
        <Typography variant="caption" className={classes.statusItem}>
          {currentUser.name}
        </Typography>
      </Grid>
    );
  }

  function renderStarRating() {
    return (
      <div className={classes.starRatingContainer} ref={starContainerRef}>
        <Rating
          allowHalfIcon
          iconsCount={10}
          size={starWidth}
          fillColor={theme.palette.primary.main}
          emptyColor={theme.palette.grey[300]}
          readonly={updatingRating}
          ratingValue={starRatingValue}
          onClick={(newVal) => {
            setStarRatingValue(newVal);
            updateBeerRating(currentUser.id, currentBeer.id, newVal / 10);
          }}
        />
      </div>
    );
  }

  function renderForm() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateBeerRating(currentUser.id, currentBeer.id, currentRatingInput);
        }}
      >
        <Grid container direction="column">
          <TextField
            fullWidth
            value={ratingInput}
            variant="outlined"
            label="Einkunn"
            autoFocus
            style={{
              maxWidth: CONTENT_WIDTH / 2,
              marginTop: !isBlind ? theme.spacing(3) : 0,
              marginBottom: theme.spacing(2),
            }}
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

  function updateBeerRating(userId: string, beerId: string, rating: number) {
    setUpdatingRating(true);

    firebase
      .database()
      .ref(`rooms/${roomCode}/users/${userId}/ratings/${beerId}`)
      .set(rating)
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
