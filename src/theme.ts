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
      fontSize: 80,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 40,
      fontWeight: 'bold',
      lineHeight: 1.1,
    },
    h3: {
      fontSize: 35,
    },
    h4: {
      fontSize: 30,
    },
    h5: {
      fontSize: 20,
    },
  },
});
