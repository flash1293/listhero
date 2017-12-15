import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import { store, persistor } from "../redux";
import { asyncComponent } from "../components/AsyncComponent";
import ThemeProvider from "../components/ThemeProvider";

class App extends Component {
  render() {
    return (
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <ThemeProvider>
            <Router>
              <div>
                <Route
                  exact
                  path="/"
                  component={asyncComponent(() => import("./Lists"))}
                />
                <Route
                  exact
                  path="/login"
                  component={asyncComponent(() => import("./Login"))}
                />
                <Route
                  exact
                  path="/edit"
                  component={asyncComponent(() => import("./ListsEdit"))}
                />
                <Route
                  exact
                  path="/lists/:id"
                  component={asyncComponent(() => import("./ViewList"))}
                />
                <Route
                  exact
                  path="/lists/:id/edit"
                  component={asyncComponent(() => import("./EditList"))}
                />
                <Route
                  exact
                  path="/lists/:id/edit/last-used"
                  component={asyncComponent(() => import("./RecentUsed"))}
                />
                <Route
                  exact
                  path="/lists/:id/edit/categories"
                  component={asyncComponent(() => import("./Categories"))}
                />
              </div>
            </Router>
          </ThemeProvider>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
