/* istanbul ignore file */
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import config from './config';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Auth0Provider
        domain={config.AUTH0_DOMAIN!}
        clientId={config.AUTH0_CLIENT_ID!}
        redirectUri={window.location.origin}
        audience={config.AUTH0_API_AUDIENCE!}
        useRefreshTokens
      >
        <App />
      </Auth0Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
