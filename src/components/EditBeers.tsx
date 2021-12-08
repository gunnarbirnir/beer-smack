import React, { useState } from 'react';
import { Grid, Button, Typography, useTheme } from '@material-ui/core';

import { IBeer } from '../interfaces';
import ActionItem from './ActionItem';
import EditBeerModal from './EditBeerModal';
import { IBeerValues } from '../interfaces/forms';

interface IProps {
  beers: IBeer[];
  createBeer: (values: IBeerValues) => Promise<void>;
  updateBeer: (values: IBeerValues, id: string) => Promise<void>;
}

const EditBeers: React.FC<IProps> = ({ beers, createBeer, updateBeer }) => {
  const theme = useTheme();
  const [addBeer, setAddBeer] = useState(false);
  const [editBeerId, setEditBeerId] = useState('');
  const [deleteBeerId, setDeleteBeerId] = useState('');

  return (
    <>
      <Grid container spacing={3}>
        <Grid
          item
          container
          xs={12}
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="h3">Bjórar</Typography>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setAddBeer(true)}
          >
            Bæta við
          </Button>
        </Grid>

        <Grid item xs={12}>
          {beers.length ? (
            beers.map((beer, index) => (
              <ActionItem
                key={beer.id}
                padding={index > 0}
                buttons={getActionButtons(beer)}
              >
                {beer.name}
              </ActionItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              Engir bjórar skráðir
            </Typography>
          )}
        </Grid>
      </Grid>
      <EditBeerModal open={addBeer} />
    </>
  );

  function getActionButtons(beer: IBeer) {
    return [
      {
        label: 'Breyta',
        onClick: () => setEditBeerId(beer.id),
      },
      {
        label: 'Eyða',
        onClick: () => setDeleteBeerId(beer.id),
      },
    ];
  }
};

export default EditBeers;
