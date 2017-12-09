import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import DragHandle from "material-ui/svg-icons/editor/drag-handle";
import ActionList from "material-ui/svg-icons/action/list";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import uuid from "uuid/v4";

const SortableDragHandle = SortableHandle(() => (
  <DragHandle style={{ float: "left", marginRight: "10px" }} />
));

const SortableItem = SortableElement(({ list, onRemove }) => {
  return (
    <ListItem
      key={list.uid}
      primaryText={list.name}
      secondaryText={`${list.activeItemCount} Einträge `}
      rightIconButton={
        <IconMenu
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={{ horizontal: "left", vertical: "top" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
        >
          <MenuItem primaryText="Löschen" onClick={onRemove} />
        </IconMenu>
      }
    >
      <SortableDragHandle />
    </ListItem>
  );
});

const SortableList = SortableContainer(({ lists, onRemove }) => {
  return (
    <List>
      {lists.map((list, index) => (
        <SortableItem
          key={list.uid}
          index={index}
          onRemove={() => onRemove(list.uid)}
          list={list}
        />
      ))}
    </List>
  );
});

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
    this.setState(
      state => ({
        addText: ""
      }),
      () => {
        this.addInput.blur();
      }
    );
  };
  onChangeAddText = (_, value) => {
    this.setState({
      addText: value
    });
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    this.props.onMove(
      this.props.lists[oldIndex].uid,
      this.props.lists[newIndex].uid
    );
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
                ref={el => (this.addInput = el)}
                value={this.state.addText}
                onChange={this.onChangeAddText}
                hintText="Neue Liste"
              />
            </form>,
            <SortableList
              key="sortable_lists"
              lists={this.props.lists}
              onRemove={this.props.onRemove}
              onSortEnd={this.onSortEnd}
              useDragHandle
            />
          ]
        ) : (
          <List>
            {this.props.lists.map(list => (
              <ListItem
                key={list.uid}
                primaryText={list.name}
                secondaryText={`${list.activeItemCount} Einträge `}
                leftIcon={<ActionList />}
                containerElement={<Link to={`/lists/${list.uid}`} />}
              />
            ))}
          </List>
        )}
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
    onMove: (oldId, newId) => {
      dispatch({
        type: "MOVE_LIST",
        oldId,
        newId
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
