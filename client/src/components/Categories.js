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

import categoryList from "../categories.json";

export class Categories extends Component {
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar
          title="Kategorien"
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
          {Object.entries(categoryList).map(([category, entries], index) => (
            <ListItem
              key={index}
              primaryTogglesNestedList
              primaryText={category}
              nestedItems={entries.map((entry, index) => (
                <ListItem
                  key={index}
                  primaryText={entry}
                  rightIcon={<ContentAdd />}
                  onClick={() => this.props.onAdd(entry)}
                />
              ))}
            />
          ))}
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
