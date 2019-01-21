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

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import routerContext from "../components/RouterContext";
import buildSelector, { list } from "../redux/selectors";
import RecentlyUsedItem from "../components/RecentlyUsedItem";

export const RecentUsed = ({ listId, list: { recentItems }, router }) => (
  <I18n>
    {t => (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton onClick={router.history.goBack} color="inherit">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" color="inherit">
              {t("recentused_title")}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {recentItems.map((entry, index) => (
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
  redirectToHome
)(RecentUsed);
