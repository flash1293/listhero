import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'
import storage from 'redux-persist/es/storage';
import uuid from 'uuid/v4';

import syncMiddleware from './syncMiddleware';
import syncReducer from './syncReducer';
import reducer from './reducer';
import { ConnectedLists, ConnectedEditList, ConnectedViewList } from './components';

const persistConfig = {
  key: 'ekofe',
  storage
}

const clientSession = uuid();
const postAction = (req) => fetch('http://localhost:3001/', {
  method: 'post',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Sync-Session': clientSession
  },
  body: JSON.stringify(req)
}).then(res=>res.json());
const syncFilter = action => action.type !== 'persist/REHYDRATE';

const persistentReducer = persistReducer(persistConfig, combineReducers({ lists: syncReducer(reducer) }));
const store = createStore(persistentReducer, applyMiddleware(syncMiddleware(postAction, syncFilter, 'lists')));
const persistor = persistStore(store);

const dispatchRefresh = () => store.dispatch({ type: '@@sync/REQUEST_SYNC' });

class App extends Component {
  componentDidMount() {
    this.ws =new WebSocket(`ws://localhost:3001/updates/${clientSession}`);
    this.ws.onmessage = () => {
      console.log("update push received");
      dispatchRefresh();
    };
    dispatchRefresh();
  }
  componentWillUnmount() {
    this.ws.close();
  }
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
