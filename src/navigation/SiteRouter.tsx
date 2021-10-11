import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import routes from './routes';

function SiteRouter() {
  const { isAuthenticated } = useAuth0();

  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route) => (
          <Route
            path={route.path}
            key={route.name}
            exact
            render={() =>
              !isAuthenticated && route.authenticated ? (
                <Redirect to="/" />
              ) : (
                route.component
              )
            }
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default SiteRouter;
