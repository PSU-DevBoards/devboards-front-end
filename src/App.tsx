import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

function App() {
  /* Check Auth0 status, if authenticated move away from landing page */
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App" data-testid="app_container">
      <Router>
        <Switch>
          <Route path="/"
          exact
          render={() =>
            isAuthenticated ? (
              <Redirect to="/dashboard"/>
            ) : (
              <Landing/>
            )}
          />

          <Route path="/dashboard"
          exact
          render={() =>
            isAuthenticated ? (
              <Dashboard/>
            ) : (
              <Redirect to="/"/>
            )}/>

          <Route path="*">
              <Redirect to="/"/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
