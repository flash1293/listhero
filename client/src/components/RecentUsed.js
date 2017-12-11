import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import ContentAdd from "material-ui/svg-icons/content/add";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import uuid from "uuid/v4";

import redirectToLogin from "./RedirectToLogin";

export class RecentUsed extends Component {
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar
          title="Zuletzt verwendet"
          iconElementLeft={
            <IconButton
              containerElement={
                <Link to={`/lists/${this.props.match.params.id}/edit`} />
              }
            >
              <NavigationArrowBack />
            </IconButton>
          }
        />
        <List>
          {this.props.recentItems.map((item, index) => (
            <ListItem
              key={index}
              rightIcon={<ContentAdd />}
              onClick={() => this.props.onAdd(item)}
              primaryText={item}
            />
          ))}
        </List>
      </div>
    );
  }
}

export const ConnectedRecentUsed = redirectToLogin(
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
