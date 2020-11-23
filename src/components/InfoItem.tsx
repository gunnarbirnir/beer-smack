import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

interface IProps {
  label: string;
  text: string;
  gutterBottom?: boolean;
}

const useStyles = makeStyles((theme) => ({
  primaryTextColor: {
    color: theme.palette.text.primary,
  },
}));

const InfoItem: React.FC<IProps> = ({ label, text, gutterBottom = true }) => {
  const classes = useStyles();

  return (
    <Typography color="textSecondary" gutterBottom={gutterBottom}>
      {label}
      {': '}
      <span className={classes.primaryTextColor}>{text}</span>
    </Typography>
  );
};

export default InfoItem;
