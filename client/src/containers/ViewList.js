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

import redirectToLogin from "../components/RedirectToLogin";
import buildHandlers, { toggleItem } from "../redux/actions";

export class ViewList extends Component {
  onToggle = item => {
    this.props.toggleItem(item.uid);
  };
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    const activeItems = this.props.items.filter(i => !i.done);
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link to="/">
              <IconButton color="inherit">
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography type="title" color="inherit" style={{ flex: 1 }}>
              {this.props.name}
            </Typography>
            <Link to={`/lists/${this.props.match.params.id}/edit`}>
              <Button color="inherit">Editieren</Button>
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

export default redirectToLogin(
  connect(
    (state, ownProps) => ({
      ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
    }),
    buildHandlers({
      toggleItem
    })
  )(ViewList)
);
