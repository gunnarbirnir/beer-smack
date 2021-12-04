import React from 'react';
import { Typography, Button, useTheme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import Layout from '../components/Layout';

const IndexPage: React.FC = () => {
  const history = useHistory();
  const theme = useTheme();

  return (
    <Layout>
      <Typography variant="h2">BeerSmack</Typography>
      <Button
        color="primary"
        variant="contained"
        onClick={() => history.push('/new-tasting')}
        style={{ marginTop: theme.spacing(4) }}
      >
        Ný smökkun
      </Button>
    </Layout>
  );
};

export default IndexPage;
