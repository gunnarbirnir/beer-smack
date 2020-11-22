import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#efad20',
    },
    secondary: {
      main: '#ffcc00',
    },
  },
  typography: {
    h1: {
      fontSize: 50,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 40,
      fontWeight: 'bold',
      lineHeight: 1.1,
    },
    h5: {
      fontSize: 20,
    },
  },
});
