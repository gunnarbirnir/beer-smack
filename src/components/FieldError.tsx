import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fieldError: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
}));

const FieldError: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="body2" className={classes.fieldError}>
      {children}
    </Typography>
  );
};

export default FieldError;
