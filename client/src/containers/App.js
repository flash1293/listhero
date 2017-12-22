import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import { store, persistor } from "../redux";
import preloader from "../components/Preloader";
import ThemeProvider from "../components/ThemeProvider";

const PreloadedRouter = preloader({
  lists: () => import("./Lists"),
  login: () => import("./Login"),
  listsEdit: () => import("./ListsEdit"),
  viewList: () => import("./ViewList"),
  editList: () => import("./EditList"),
  recentUsed: () => import("./RecentUsed"),
  categories: () => import("./Categories")
})(
  ({ lists, login, listsEdit, viewList, editList, recentUsed, categories }) => (
    <Router>
      <div>
        <Route exact path="/" component={lists} />
        <Route exact path="/login" component={login} />
        <Route exact path="/edit" component={listsEdit} />
        <Route exact path="/lists/:id" component={viewList} />
        <Route exact path="/lists/:id/edit" component={editList} />
        <Route exact path="/lists/:id/edit/last-used" component={recentUsed} />
        <Route exact path="/lists/:id/edit/categories" component={categories} />
      </div>
    </Router>
  )
);

export default () => (
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <PreloadedRouter />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
