import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Edit from "material-ui-icons/Edit";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import buildHandlers, { toggleItem } from "../redux/actions";
import buildSelector, { list, activeItems } from "../redux/selectors";

export const ViewList = ({
  list: { name },
  activeItems,
  listId,
  toggleItem
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to="/">
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {name}
        </Typography>
        <Link to={`/lists/${listId}/edit`}>
          <IconButton aria-label="Editieren" color="inherit">
            <Edit />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
    <List>
      {activeItems.map((item, index) => (
        <ListItem button key={index} onClick={() => toggleItem(item)}>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(
    buildSelector({ list, activeItems }),
    buildHandlers({
      toggleItem
    })
  ),
  redirectToHome
)(ViewList);
