import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List from "material-ui/List";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import buildSelector, { list } from "../redux/selectors";
import AddableItem from "../components/AddableItem";

export const RecentUsed = ({ listId, list: { recentItems } }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to={`/lists/${listId}/edit`}>
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit">
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
  redirectToHome
)(RecentUsed);
