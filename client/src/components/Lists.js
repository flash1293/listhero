import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import DragHandle from "material-ui-icons/DragHandle";
import ActionList from "material-ui-icons/List";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import redirectToLogin from "./RedirectToLogin";

const SortableDragHandle = SortableHandle(() => (
  <DragHandle style={{ float: "left", marginRight: "10px" }} />
));

const SortableItem = SortableElement(({ list, onRemove, onEdit }) => {
  return (
    <ListItem key={list.uid}>
      <ListItemIcon>
        <SortableDragHandle />
      </ListItemIcon>
      <ListItemText
        primary={list.name}
        secondary={`${list.activeItemCount} Einträge `}
      />
      <ListItemIcon onClick={onRemove}>
        <Delete />
      </ListItemIcon>
      <ListItemIcon onClick={onEdit}>
        <Edit />
      </ListItemIcon>
    </ListItem>
  );
});

const SortableList = SortableContainer(({ lists, onRemove, onEdit }) => {
  return (
    <List>
      {lists.map((list, index) => (
        <SortableItem
          key={list.uid}
          index={index}
          onRemove={() => onRemove(list.uid)}
          onEdit={() => onEdit(list)}
          list={list}
        />
      ))}
    </List>
  );
});

export class Lists extends Component {
  state = {
    editMode: false,
    addText: "",
    dialogText: "",
    dialogId: null
  };
  onToggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };
  onAdd = e => {
    e.preventDefault();
    this.props.onAdd(this.state.addText);
    this.setState(state => ({
      addText: ""
    }));
  };
  onChangeAddText = e => {
    this.setState({
      addText: e.target.value
    });
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    this.props.onMove(
      this.props.lists[oldIndex].uid,
      this.props.lists[newIndex].uid
    );
  };
  onListChange = ({ uid: dialogId, name: dialogText }) =>
    this.setState({ dialogId, dialogText });

  handleDialogClose = () => {
    this.setState({ dialogId: null });
  };
  onChangeList = list => {
    this.setState({ dialogId: list.uid, dialogText: list.name });
  };
  onChangeDialogText = e => {
    this.setState({
      dialogText: e.target.value
    });
  };
  handleChangeList = e => {
    e.preventDefault();
    this.props.onChangeList(this.state.dialogId, this.state.dialogText);
    this.setState({ dialogId: null, dialogText: "" });
  };
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography type="title" color="inherit" style={{ flex: 1 }}>
              Alle Listen
            </Typography>
            <Button onClick={this.onToggleEditMode}>
              {this.state.editMode ? "Schließen" : "Editieren"}
            </Button>
          </Toolbar>
        </AppBar>
        {this.state.editMode ? (
          [
            <form
              key="add_form"
              onSubmit={this.onAdd}
              style={{ margin: "10px" }}
            >
              <TextField
                fullWidth
                autoFocus
                key="add-textfield"
                value={this.state.addText}
                onChange={this.onChangeAddText}
                placeholder="Neue Liste"
              />
            </form>,
            <SortableList
              key="sortable_lists"
              lists={this.props.lists}
              onRemove={this.props.onRemove}
              onEdit={this.onListChange}
              onSortEnd={this.onSortEnd}
              useDragHandle
            />
          ]
        ) : (
          <List>
            {this.props.lists.map(list => (
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
        )}
        {this.props.lists.length === 0 && (
          <Paper style={{ padding: "20px" }} elevation={2}>
            Noch keine Listen angelegt.<br />Tippe rechts oben "Editieren", um
            eine Liste hinzuzufügen.
          </Paper>
        )}
        <Dialog
          open={this.state.dialogId !== null}
          onRequestClose={this.handleDialogClose}
        >
          <DialogContent>
            <form onSubmit={this.handleChangeList}>
              <TextField
                name="editField"
                fullWidth
                autoFocus
                value={this.state.dialogText}
                onChange={this.onChangeDialogText}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Abbrechen</Button>
            <Button color="primary" onClick={this.handleChangeList}>
              Speichern
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export const ConnectedLists = redirectToLogin(
  connect(
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
      onMove: (oldId, newId) => {
        dispatch({
          type: "MOVE_LIST",
          oldId,
          newId
        });
      },
      onChangeList: (list, name) => {
        dispatch({
          type: "EDIT_LIST",
          list,
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
  )(Lists)
);
