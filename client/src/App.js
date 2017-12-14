import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import storage from "redux-persist/es/storage";
import uuid from "uuid/v4";

import syncMiddleware from "./syncMiddleware";
import syncReducer from "./syncReducer";
import listReducer from "./listReducer";
import userReducer from "./userReducer";
import {
  ConnectedLists,
  ConnectedLogin,
  ConnectedEditList,
  ConnectedRecentUsed,
  ConnectedCategories,
  ConnectedViewList
} from "./components";

const APP_VERSION = 2;

const persistConfig = {
  key: `ekofe-${APP_VERSION}`,
  storage
};

let API_PROTOCOL = window.location.protocol;
let API_HOST = window.location.host;
if (window.location.hostname === "localhost") {
  API_HOST = "localhost:3001";
}

const clientSession = uuid();
const postAction = req =>
  fetch(`${API_PROTOCOL}//${API_HOST}/api`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Sync-Session": clientSession,
      Authorization: `Basic ${btoa("user:" + store.getState().user.password)}`
    },
    body: JSON.stringify(req)
  }).then(res => res.json());
const syncFilter = action => action.type !== "persist/REHYDRATE";

const refreshOnRehydrateMiddleware = store => next => action => {
  let result = next(action);
  if (action.type === "persist/REHYDRATE" && store.getState().user.loggedIn) {
    next({
      type: "@@sync/REQUEST_SYNC",
      key: "lists"
    });
  }
  return result;
};

const persistentReducer = persistReducer(
  persistConfig,
  combineReducers({
    lists: syncReducer(listReducer, "lists"),
    user: userReducer
  })
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
    this.ws = new WebSocket(
      `ws${
        API_PROTOCOL === "https:" ? "s" : ""
      }://${API_HOST}/api/updates/${clientSession}`,
      store.getState().user.password
    );
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
    if (store.getState().user.loggedIn) {
      this.setupWs();
    } else {
      store.subscribe(() => {
        if (store.getState().user.loggedIn && !this.ws) {
          this.setupWs();
        }
      });
    }
  }
  componentWillUnmount() {
    this.ws.onclose = undefined;
    this.ws.close();
  }
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <Router>
            <div>
              <Route exact path="/" component={ConnectedLists} />
              <Route exact path="/login" component={ConnectedLogin} />
              <Route exact path="/lists/:id" component={ConnectedViewList} />
              <Route
                exact
                path="/lists/:id/edit"
                component={ConnectedEditList}
              />
              <Route
                exact
                path="/lists/:id/edit/last-used"
                component={ConnectedRecentUsed}
              />
              <Route
                exact
                path="/lists/:id/edit/categories"
                component={ConnectedCategories}
              />
            </div>
          </Router>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
