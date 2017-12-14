import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText } from "material-ui/List";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import redirectToLogin from "./RedirectToLogin";

export class ViewList extends Component {
  onToggle = item => {
    this.props.onToggle(item.uid);
  };
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    const activeItems = this.props.items.filter(i => !i.done);
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Link to="/">
              <IconButton>
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography type="title" color="inherit" style={{ flex: 1 }}>
              {this.props.name}
            </Typography>
            <Link to={`/lists/${this.props.match.params.id}/edit`}>
              <Button>Editieren</Button>
            </Link>
          </Toolbar>
        </AppBar>
        <List>
          {activeItems.map((item, index) => (
            <ListItem button key={index} onClick={() => this.onToggle(item)}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export const ConnectedViewList = redirectToLogin(
  connect(
    (state, ownProps) => ({
      ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
    }),
    (dispatch, ownProps) => ({
      onToggle: index => {
        dispatch({
          type: "TOGGLE_ITEM",
          list: ownProps.match.params.id,
          item: index
        });
      }
    })
  )(ViewList)
);
