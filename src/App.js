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


import syncMiddleware from './syncMiddleware';
import syncReducer from './syncReducer';
import reducer from './reducer';
import { ConnectedLists, ConnectedEditList, ConnectedViewList } from './components';
import { setInterval } from 'timers';

const persistConfig = {
  key: 'ekofe',
  storage
}

const postAction = (req) => fetch('http://localhost:3001/', {
  method: 'post',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
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
    this.interval = setInterval(dispatchRefresh, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
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
