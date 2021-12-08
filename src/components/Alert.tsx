import React from 'react';
import { useTheme, Snackbar, SnackbarCloseReason } from '@material-ui/core';
import MuiAlert, { Color } from '@material-ui/lab/Alert';

interface IProps {
  open: boolean;
  message: string;
  severity: Color;
  autoHideDuration?: number;
  onClose: () => void;
}

const Alert: React.FC<IProps> = ({
  open,
  message,
  severity,
  autoHideDuration = 3000,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleCloseNotifier}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      style={{ marginBottom: theme.spacing(3) }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={handleCloseNotifier}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );

  function handleCloseNotifier(
    event: React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  }
};

export default Alert;
