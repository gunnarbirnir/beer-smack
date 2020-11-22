import React from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import cx from 'classnames';

import { CONTENT_WIDTH } from '../constants';

interface IProps {
  loading?: boolean;
  error?: string;
  fullWidth?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  loading: {
    height: `calc(100vh - ${theme.spacing(3) * 2}px)`,
  },
  contentWidth: {
    maxWidth: CONTENT_WIDTH,
    margin: '0px auto',
  },
}));

const Layout: React.FC<IProps> = ({
  loading,
  error,
  children,
  fullWidth = false,
}) => {
  const classes = useStyles();
  var content = null;

  if (loading) {
    content = (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.loading}
      >
        <CircularProgress />
      </Grid>
    );
  } else if (error) {
    content = <Typography variant="h2">{error}</Typography>;
  }

  return (
    <div
      className={cx(classes.container, { [classes.contentWidth]: !fullWidth })}
    >
      {content || children}
    </div>
  );
};

export default Layout;
