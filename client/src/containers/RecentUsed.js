import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";
import { I18n } from "react-i18next";
import { withState } from "recompose";
import Sort from "@material-ui/icons/Sort";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import routerContext from "../components/RouterContext";
import buildSelector, { list } from "../redux/selectors";
import RecentlyUsedItem from "../components/RecentlyUsedItem";

export const RecentUsed = ({ listId, list: { recentItems }, router, sortList, setSortList }) => (
  <I18n>
    {t => (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton onClick={router.history.goBack} color="inherit">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {t("recentused_title")}
            </Typography>
              <IconButton
                onClick={() => setSortList(!sortList)}
                color="inherit"
                style={{ opacity: sortList ? 1 : 0.5 }}
              >
                <Sort />
              </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          {(sortList ? [...recentItems].sort() : recentItems).map((entry, index) => (
            <RecentlyUsedItem key={entry} listId={listId} entry={entry} />
          ))}
        </List>
      </div>
    )}
  </I18n>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(buildSelector({ list })),
  routerContext,
  redirectToHome,
  withState('sortList', 'setSortList', false)
)(RecentUsed);
