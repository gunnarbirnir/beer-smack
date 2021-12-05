import React, { useState } from 'react';
import {
  makeStyles,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import FieldError from './FieldError';
import { IRoom, IBeer } from '../interfaces';
import ListItem from './ListItem';

interface IProps {
  beers: IBeer[];
  createBeer: (values: IValues) => Promise<void>;
  updateBeer: (values: IValues, id: string) => Promise<void>;
}

export interface IValues {
  name: string;
  index: number;
  type: string;
  abv: number;
  active: boolean;
  brewer: string;
  country: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  index: yup.number().required(),
  type: yup.string().required(),
  abv: yup.number().required(),
  active: yup.boolean().required(),
  brewer: yup.string().required(),
  country: yup.string().required(),
  description: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({}));

const EditBeers: React.FC<IProps> = ({ beers, createBeer, updateBeer }) => {
  const classes = useStyles();

  const [addBeerOpen, setAddBeerOpen] = useState(false);
  const [editBeerId, setEditBeerId] = useState('');

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        direction="row"
        justify="space-between"
        alignItems="center"
        style={{ display: 'flex' }}
      >
        <Typography variant="h3">Bjórar</Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setAddBeerOpen(true)}
        >
          Bæta við
        </Button>
      </Grid>

      <Grid item xs={12}>
        {beers.length ? (
          beers.map((beer) => (
            // TODO: Create new component
            <ListItem
              key={beer.id}
              mainText={beer.name}
              onClick={() => setEditBeerId(beer.id)}
            />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            Engir bjórar skráðir
          </Typography>
        )}
      </Grid>
    </Grid>
  );

  function getInitialValues() {
    return {
      name: 'Test Bjór',
      index: 0,
      type: 'IPA',
      abv: 5,
      active: true,
      brewer: 'Borg',
      country: 'Ísland',
      description: 'Góður bjór',
    };
  }
};

export default EditBeers;
