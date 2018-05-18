import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import routerContext from "../components/RouterContext";
import buildSelector, { list } from "../redux/selectors";
import AddableItem from "../components/AddableItem";

export const RecentUsed = ({ listId, list: { recentItems }, router }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton onClick={router.history.goBack} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography variant="title" color="inherit">
          Zuletzt verwendet
        </Typography>
      </Toolbar>
    </AppBar>
    <List>
      {recentItems.map((entry, index) => (
        <AddableItem key={entry} listId={listId} entry={entry} />
      ))}
    </List>
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(buildSelector({ list })),
  routerContext,
  redirectToHome
)(RecentUsed);
