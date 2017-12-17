import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import ActionList from "material-ui-icons/List";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import { compose } from "redux";

import redirectToLogin from "../components/RedirectToLogin";
import { Logo } from "../components/Logo";
import buildSelector, { listsWithActiveItemCount } from "../redux/selectors";

export const Lists = ({ lists }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Logo inverted />
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          Alle Listen
        </Typography>
        <Link to="/edit">
          <Button color="inherit">Editieren</Button>
        </Link>
      </Toolbar>
    </AppBar>
    <List>
      {lists.map(list => (
        <Link key={list.uid} to={`/lists/${list.uid}`}>
          <ListItem button>
            <ListItemIcon>
              <ActionList />
            </ListItemIcon>
            <ListItemText
              primary={list.name}
              secondary={`${list.activeItemCount} Einträge `}
            />
          </ListItem>
        </Link>
      ))}
    </List>
    {lists.length === 0 && (
      <Paper style={{ padding: "20px" }} elevation={2}>
        <Typography>
          Noch keine Listen angelegt.<br />Tippe rechts oben "Editieren", um
          eine Liste hinzuzufügen.
        </Typography>
      </Paper>
    )}
  </div>
);

export default compose(
  redirectToLogin,
  connect(
    buildSelector({
      lists: listsWithActiveItemCount
    })
  )
)(Lists);
