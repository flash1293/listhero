import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { I18nextProvider } from "react-i18next";
import { ShortcutManager } from "react-shortcuts";
import { withContext } from "recompose";
import PropTypes from "prop-types";

import i18n from "../i18n";
import { store, persistor } from "../redux";
import preloader from "../components/Preloader";
import ThemeProvider from "../components/ThemeProvider";
import Lists from "./Lists";
import Login from "./Login";

import keymap from "../keymap";

const shortcutManager = new ShortcutManager(keymap);

const PreloadedRouter = preloader({
  viewList: () => import("./ViewList"),
  editList: () => import("./EditList"),
  recentUsed: () => import("./RecentUsed"),
  syncQrCode: () => import("./SyncQrCode"),
  categories: () => import("./Categories")
})(
  ({
    listSettings,
    viewList,
    editList,
    syncQrCode,
    recentUsed,
    categories
  }) => (
    <Router>
      <div>
        <Route exact path="/" component={Lists} />
        <Route exact path="/login" component={Login} />
        <Route
          exact
          path="/login/:username/:password/:encryptionKey/:serverPassword"
          component={Login}
        />
        <Route
          exact
          path="/login/:username/:password/:encryptionKey/"
          component={Login}
        />
        <Route exact path="/qr" component={syncQrCode} />
        <Route exact path="/lists/:id/entries" component={viewList} />
        <Route exact path="/lists/:id/entries/edit" component={editList} />
        <Route
          exact
          path="/lists/:id/entries/last-used"
          component={recentUsed}
        />
        <Route
          exact
          path="/lists/:id/entries/categories"
          component={categories}
        />
      </div>
    </Router>
  )
);

export default withContext({ shortcuts: PropTypes.object.isRequired }, () => ({
  shortcuts: shortcutManager
}))(() => (
  <I18nextProvider i18n={i18n}>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <ThemeProvider>
          <PreloadedRouter />
        </ThemeProvider>
      </Provider>
    </PersistGate>
  </I18nextProvider>
));
