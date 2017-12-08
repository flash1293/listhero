import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ContentRemove from "material-ui/svg-icons/content/remove";
import ActionList from "material-ui/svg-icons/action/list";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import uuid from "uuid/v4";

export class Lists extends Component {
  state = {
    editMode: false,
    addText: ""
  };
  onToggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode }, () => {
      if (this.state.editMode) this.addInput.focus();
    });
  };
  onAdd = e => {
    e.preventDefault();
    this.props.onAdd(this.state.addText);
    this.setState(state => ({
      editMode: false,
      addText: ""
    }));
  };
  onChangeAddText = (_, value) => {
    this.setState({
      addText: value
    });
  };
  render() {
    return (
      <div>
        <AppBar
          title="Alle Listen"
          showMenuIconButton={false}
          iconElementRight={
            <FlatButton
              label={this.state.editMode ? "Schließen" : "Editieren"}
              onClick={this.onToggleEditMode}
            />
          }
        />
        {this.state.editMode && (
          <form onSubmit={this.onAdd} style={{ margin: "10px" }}>
            <TextField
              fullWidth
              key="add-textfield"
              ref={el => (this.addInput = el)}
              value={this.state.addText}
              onChange={this.onChangeAddText}
              hintText="Neue Liste"
            />
          </form>
        )}
        <List>
          {this.props.lists.map(list => (
            <ListItem
              key={list.uid}
              primaryText={list.name}
              secondaryText={`${list.activeItemCount} Einträge `}
              leftIcon={<ActionList />}
              rightIconButton={
                this.state.editMode ? (
                  <IconButton onClick={() => this.props.onRemove(list.uid)}>
                    <ContentRemove color="action" />
                  </IconButton>
                ) : (
                  undefined
                )
              }
              containerElement={
                !this.state.editMode ? (
                  <Link to={`/lists/${list.uid}`} />
                ) : (
                  undefined
                )
              }
            />
          ))}
        </List>
        {this.props.lists.length === 0 && (
          <Paper style={{ padding: "20px" }} zDepth={2}>
            Noch keine Listen angelegt.<br />Tippe rechts oben "Editieren", um
            eine Liste hinzuzufügen.
          </Paper>
        )}
      </div>
    );
  }
}

export const ConnectedLists = connect(
  state => ({
    lists: (state.lists ? state.lists.present || [] : []).map(list => ({
      ...list,
      activeItemCount: list.items.filter(i => !i.done).length
    }))
  }),
  dispatch => ({
    onAdd: name => {
      dispatch({
        type: "ADD_LIST",
        uid: uuid(),
        name
      });
    },
    onRemove: list => {
      dispatch({
        type: "REMOVE_LIST",
        list
      });
    }
  })
)(Lists);
