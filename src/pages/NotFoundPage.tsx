import React from 'react';
import { Typography } from '@material-ui/core';

import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h2">404 Page not found</Typography>
    </Layout>
  );
};

export default NotFoundPage;
