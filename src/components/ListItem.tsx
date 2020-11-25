import React from 'react';
import { Typography, makeStyles, Grid, useTheme } from '@material-ui/core';
import cx from 'classnames';

interface IProps {
  mainText: string;
  secondaryText?: string;
  highlighted?: boolean;
  padding?: boolean;
  large?: boolean;
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
  },
  highlighted: {
    backgroundColor: theme.palette.secondary.light,
  },
  largeText: {
    fontSize: 25,
  },
}));

const ListItem: React.FC<IProps> = ({
  mainText,
  secondaryText,
  highlighted = false,
  padding = true,
  large = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div
      className={cx(classes.listItem, {
        [classes.highlighted]: highlighted,
      })}
      style={{ marginTop: padding ? theme.spacing(2) : 0 }}
    >
      <Grid container direction="row" justify="space-between">
        <Typography
          className={cx({ [classes.largeText]: large })}
          style={{ marginRight: theme.spacing(2) }}
        >
          {mainText}
        </Typography>
        {secondaryText && (
          <Typography className={cx({ [classes.largeText]: large })}>
            {secondaryText}
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default ListItem;
