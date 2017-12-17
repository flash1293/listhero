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
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import DragHandle from "material-ui-icons/DragHandle";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import { connect } from "react-redux";
import uuid from "uuid/v4";

import redirectToLogin from "../components/RedirectToLogin";
import ChangeNameDialog from "../components/ChangeNameDialog";
import AddForm from "../components/AddForm";

const SortableDragHandle = SortableHandle(() => (
  <DragHandle style={{ float: "left", marginRight: "10px" }} />
));

const SortableItem = SortableElement(({ list, onRemove, onEdit }) => {
  return (
    <ListItem key={list.uid}>
      <ListItemIcon>
        <IconButton>
          <SortableDragHandle />
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={list.name} />
      <ListItemIcon>
        <IconButton onClick={onRemove}>
          <Delete />
        </IconButton>
      </ListItemIcon>
      <ListItemIcon>
        <IconButton onClick={onEdit}>
          <Edit />
        </IconButton>
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

export class ListsEdit extends Component {
  state = {
    dialogList: null
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    this.props.onMove(
      this.props.lists[oldIndex].uid,
      this.props.lists[newIndex].uid
    );
  };
  handleDialogClose = () => {
    this.setState({ dialogList: null });
  };
  onChangeList = list => {
    this.setState({ dialogList: list });
  };
  handleChangeList = text => {
    this.props.onChangeList(this.state.dialogList.uid, text);
    this.setState({ dialogList: null });
  };
  render() {
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
              Listen editieren
            </Typography>
          </Toolbar>
        </AppBar>
        <AddForm placeholder="Neue Liste" onSubmit={this.props.onAdd} />
        <SortableList
          lists={this.props.lists}
          onRemove={this.props.onRemove}
          onEdit={this.onChangeList}
          onSortEnd={this.onSortEnd}
          useDragHandle
        />
        {this.state.dialogList && (
          <ChangeNameDialog
            initialText={this.state.dialogList.name}
            onClose={this.handleDialogClose}
            onSubmit={this.handleChangeList}
          />
        )}
      </div>
    );
  }
}

export default redirectToLogin(
  connect(
    state => ({
      lists: state.lists ? state.lists.present || [] : []
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
  )(ListsEdit)
);
