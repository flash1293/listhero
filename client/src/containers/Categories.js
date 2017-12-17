import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import Add from "material-ui-icons/Add";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import compose from "ramda/src/compose";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import buildHandlers, { addStackableItem } from "../redux/actions";
import collapsable from "../components/Collapsable";

import categoryList from "../data/categories.json";

const Categories = ({ open, toggle, uid, addStackableItem }) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to={`/lists/${uid}/edit`}>
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit">
          Kategorien
        </Typography>
      </Toolbar>
    </AppBar>
    <List>
      {Object.entries(categoryList).map(([category, entries], index) => [
        <ListItem button onClick={() => toggle(category)} key={index}>
          <ListItemText primary={category} />
          {open[category] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>,
        <Collapse
          key={`${index}-collapse`}
          component="li"
          in={open[category]}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding>
            {entries.map((entry, index) => (
              <ListItem
                button
                onClick={() => addStackableItem(entry)}
                key={index}
                style={{ paddingLeft: "38px", paddingRight: 0 }}
              >
                <ListItemText primary={entry} />
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </Collapse>
      ])}
    </List>
  </div>
);

export default compose(
  redirectToLogin,
  redirectToHome,
  connect(
    (state, ownProps) => ({
      ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
    }),
    buildHandlers({
      addStackableItem
    })
  ),
  collapsable
)(Categories);
