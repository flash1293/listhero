import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
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
        <AppBar
          title={this.props.name}
          iconElementLeft={
            <IconButton containerElement={<Link to="/" />}>
              <NavigationArrowBack />
            </IconButton>
          }
          iconElementRight={
            <FlatButton
              label="Editieren"
              containerElement={
                <Link to={`/lists/${this.props.match.params.id}/edit`} />
              }
            />
          }
        />
        <List>
          {activeItems.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => this.onToggle(item)}
              primaryText={item.name}
            />
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
