import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'
import storage from 'redux-persist/es/storage';


import reducer from './reducer';
import { ConnectedLists, ConnectedEditList, ConnectedViewList } from './components';

const persistConfig = {
  key: 'ekofe',
  storage
}

const persistentReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistentReducer);
const persistor = persistStore(store);

class App extends Component {
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <MuiThemeProvider>
            <Router>
              <div>
                <Route exact path="/" component={ConnectedLists} />
                <Route exact path="/lists/:id" component={ConnectedViewList} />
                <Route exact path="/lists/:id/edit" component={ConnectedEditList} />
              </div>
            </Router>
          </MuiThemeProvider>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
