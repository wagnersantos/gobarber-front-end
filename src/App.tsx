import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyle from './core/assets/styles/global';

import Routes from './routes';

import AppProvider from './core/hooks';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </BrowserRouter>
);

export default App;
