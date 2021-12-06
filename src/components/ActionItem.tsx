import React from 'react';
import {
  Typography,
  makeStyles,
  Grid,
  useTheme,
  Button,
} from '@material-ui/core';

interface IProps {
  padding?: boolean;
  buttons: {
    label: string;
    onClick: () => void;
  }[];
}

const useStyles = makeStyles((theme) => ({
  actionItem: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
  },
}));

const ActionItem: React.FC<IProps> = ({ children, padding, buttons }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div
      className={classes.actionItem}
      style={{ marginTop: padding ? theme.spacing(2) : 0 }}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography>{children}</Typography>
        <div>
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              style={{ marginLeft: theme.spacing(2) }}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </Grid>
    </div>
  );
};

export default ActionItem;
