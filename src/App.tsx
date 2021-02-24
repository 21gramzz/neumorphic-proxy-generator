import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { GlobalStyle, theme } from './style/GlobalStyles';
import store, { persistor } from './stores';
import { PersistGate } from 'redux-persist/integration/react';
import Tasks from './App/Tasks';
import './icon/fontawsome';
import './electron/api.interface';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Tasks />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
