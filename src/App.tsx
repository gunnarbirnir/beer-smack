import React from 'react';
import 'fontsource-roboto';
import { ThemeProvider } from '@material-ui/core/styles';
import { FirebaseDatabaseProvider } from '@react-firebase/database';

import theme from './theme';
import Router from './Router';
import db from './firebase';

const App: React.FC = () => {
  return (
    <FirebaseDatabaseProvider firebase={db}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </FirebaseDatabaseProvider>
  );
};

export default App;
