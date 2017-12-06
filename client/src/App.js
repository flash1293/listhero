import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import storage from "redux-persist/es/storage";
import uuid from "uuid/v4";

import syncMiddleware from "./syncMiddleware";
import syncReducer from "./syncReducer";
import reducer from "./reducer";
import {
  ConnectedLists,
  ConnectedEditList,
  ConnectedViewList
} from "./components";

const APP_VERSION = 1;

const persistConfig = {
  key: `ekofe-${APP_VERSION}`,
  storage
};

const API_URL = `${window.location.host}/api`;

const clientSession = uuid();
const postAction = req =>
  fetch(`http://${API_URL}/`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Sync-Session": clientSession
    },
    body: JSON.stringify(req)
  }).then(res => res.json());
const syncFilter = action => action.type !== "persist/REHYDRATE";

const refreshOnRehydrateMiddleware = store => next => action => {
  let result = next(action);
  if (action.type === "persist/REHYDRATE") {
    next({
      type: "@@sync/REQUEST_SYNC",
      key: "lists"
    });
  }
  return result;
};

const persistentReducer = persistReducer(
  persistConfig,
  combineReducers({ lists: syncReducer(reducer, "lists") })
);
const store = createStore(
  persistentReducer,
  applyMiddleware(
    refreshOnRehydrateMiddleware,
    syncMiddleware(postAction, syncFilter, "lists")
  )
);
const persistor = persistStore(store);

const dispatchRefresh = () =>
  store.dispatch({ type: "@@sync/REQUEST_SYNC", key: "lists" });

class App extends Component {
  setupWs = () => {
    console.log("websocket started");
    this.ws = new WebSocket(`ws://${API_URL}/updates/${clientSession}`);
    this.ws.onmessage = () => {
      console.log("update push received");
      dispatchRefresh();
    };
    this.ws.onerror = e => {
      console.log("websocket-error", e);
    };
    this.ws.onclose = () => {
      console.log("closed, restart websocket");
      setTimeout(this.setupWs, 0);
    };
  };
  componentDidMount() {
    this.setupWs();
  }
  componentWillUnmount() {
    this.ws.onclose = undefined;
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
                <Route
                  exact
                  path="/lists/:id/edit"
                  component={ConnectedEditList}
                />
              </div>
            </Router>
          </MuiThemeProvider>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
