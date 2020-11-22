import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import IndexPage from './pages/IndexPage';
import RatingPage from './pages/RatingPage';
import StatusPage from './pages/StatusPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/:code" component={RatingPage} />
        <Route exact path="/:code/status" component={StatusPage} />
        <Route exact path="/:code/admin" component={AdminPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
