import { useAuth0 } from '@auth0/auth0-react';
import { Container } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { OrganizationProvider } from '../contexts/organization-context';
import routes from './routes';

function SiteRouter() {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <BrowserRouter>
      <Switch>
        {!isLoading &&
          routes.map((route) => (
            <Route
              path={route.path}
              key={route.name}
              exact
              render={() =>
                !isAuthenticated && route.authenticated ? (
                  <Redirect to="/" />
                ) : (
                  <OrganizationProvider>
                    <Container maxW="" px="1%" pt="5px">
                      {isAuthenticated && <Navbar />}
                      {route.component}
                    </Container>
                  </OrganizationProvider>
                )
              }
            />
          ))}
      </Switch>
    </BrowserRouter>
  );
}

export default SiteRouter;
