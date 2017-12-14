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
import uuid from "uuid/v4";

import redirectToLogin from "./RedirectToLogin";

import categoryList from "../categories.json";

export class Categories extends Component {
  state = {
    open: {}
  };
  handleOpen(category) {
    this.setState({
      open: {
        ...this.state.open,
        [category]: !this.state.open[category]
      }
    });
  }
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Link to={`/lists/${this.props.match.params.id}/edit`}>
              <IconButton>
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
            <ListItem
              button
              onClick={() => this.handleOpen(category)}
              key={index}
            >
              <ListItemText primary={category} />
              {this.state.open[category] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>,
            <Collapse
              key={`${index}-collapse`}
              component="li"
              in={this.state.open[category]}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {entries.map((entry, index) => (
                  <ListItem
                    button
                    onClick={() => this.props.onAdd(entry)}
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
  }
}

export const ConnectedCategories = redirectToLogin(
  connect(
    (state, ownProps) => ({
      ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
    }),
    (dispatch, ownProps) => ({
      onAdd: name => {
        dispatch({
          type: "ADD_ITEM",
          list: ownProps.match.params.id,
          uid: uuid(),
          stackIfPossible: true,
          name
        });
      }
    })
  )(Categories)
);
