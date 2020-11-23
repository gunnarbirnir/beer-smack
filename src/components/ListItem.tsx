import React from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import cx from 'classnames';

interface IProps {
  mainText: string;
  secondaryText?: string;
  highlighted?: boolean;
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
  highlighted: {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const ListItem: React.FC<IProps> = ({
  mainText,
  secondaryText,
  highlighted = false,
}) => {
  const classes = useStyles();

  return (
    <div
      className={cx(classes.listItem, {
        [classes.highlighted]: highlighted,
      })}
    >
      <Grid container direction="row" justify="space-between">
        <Typography>{mainText}</Typography>
        {secondaryText && <Typography>{secondaryText}</Typography>}
      </Grid>
    </div>
  );
};

export default ListItem;
