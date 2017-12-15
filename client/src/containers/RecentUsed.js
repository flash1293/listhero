import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import ContentAdd from "material-ui-icons/Add";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import uuid from "uuid/v4";

import redirectToLogin from "../components/RedirectToLogin";

export class RecentUsed extends Component {
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link to={`/lists/${this.props.match.params.id}/edit`}>
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
          {this.props.recentItems.map((item, index) => (
            <ListItem button key={index} onClick={() => this.props.onAdd(item)}>
              <ListItemText primary={item} />
              <ListItemIcon>
                <ContentAdd />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default redirectToLogin(
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
          name
        });
      }
    })
  )(RecentUsed)
);
