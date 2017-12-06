import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import { Link } from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import IconButton from "material-ui/IconButton";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import DragHandle from "material-ui/svg-icons/editor/drag-handle";
import Divider from "material-ui/Divider";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import { Redirect } from "react-router";

const SortableDragHandle = SortableHandle(() => <DragHandle />);

const SortableItem = SortableElement(({ item }) => {
  const containerStyle = {
    display: "flex",
    alignItems: "center"
  };
  const labelStyle = {
    paddingLeft: "10px"
  };

  return (
    <ListItem>
      <div style={containerStyle}>
        <SortableDragHandle /> <span style={labelStyle}>{item.name}</span>
      </div>
    </ListItem>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <SortableItem key={item.uid} index={index} item={item} />
      ))}
    </List>
  );
});

export class EditList extends Component {
  state = {
    addText: ""
  };
  onRequestAdd = () => {
    this.setState({ addMode: true }, () => {
      this.addInput.focus();
    });
  };
  onAdd = e => {
    e.preventDefault();
    this.props.onAdd(this.state.addText);
    this.setState(state => ({
      addText: ""
    }));
  };
  onChangeAddText = (_, value) => {
    this.setState({
      addText: value
    });
  };
  onSortEndActive = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    this.props.onMove(
      this.props.activeItems[oldIndex].uid,
      this.props.activeItems[newIndex].uid
    );
  };
  onToggle = item => {
    this.props.onToggle(item.uid);
  };
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar
          title={`${this.props.name} editieren`}
          iconElementLeft={
            <IconButton
              containerElement={
                <Link to={`/lists/${this.props.match.params.id}`} />
              }
            >
              <NavigationClose />
            </IconButton>
          }
        />
        <form onSubmit={this.onAdd} style={{ margin: "10px" }}>
          <TextField
            fullWidth
            key="add-textfield"
            ref={el => (this.addInput = el)}
            value={this.state.addText}
            onChange={this.onChangeAddText}
            hintText="Neuer Eintrag"
          />
        </form>

        <SortableList
          items={this.props.activeItems}
          onSortEnd={this.onSortEndActive}
          useDragHandle
        />
        {this.props.doneItems.length > 0 && <Divider inset={true} />}
        {this.props.doneItems.length > 0 && (
          <FlatButton
            labelStyle={{ fontSize: "0.7em" }}
            label="Erledigte Löschen"
            onClick={this.props.onRemove}
          />
        )}
        <List>
          {this.props.doneItems.map((item, index) => (
            <ListItem
              style={{ color: "#aaa" }}
              key={index}
              primaryText={item.name}
              onClick={() => this.onToggle(item)}
            />
          ))}
        </List>
      </div>
    );
  }
}

export const ConnectedEditList = connect(
  (state, ownProps) => {
    const list = state.lists.present.find(
      l => l.uid === ownProps.match.params.id
    );
    return {
      ...list,
      doneItems: list.items.filter(i => i.done),
      activeItems: list.items.filter(i => !i.done)
    };
  },
  (dispatch, ownProps) => ({
    onAdd: name => {
      dispatch({
        type: "ADD_ITEM",
        list: ownProps.match.params.id,
        uid: uuid(),
        name
      });
    },
    onRemove: () => {
      dispatch({
        type: "REMOVE_DONE",
        list: ownProps.match.params.id
      });
    },
    onMove: (oldId, newId) => {
      dispatch({
        type: "MOVE_ITEM",
        list: ownProps.match.params.id,
        oldId,
        newId
      });
    },
    onToggle: index => {
      dispatch({
        type: "TOGGLE_ITEM",
        list: ownProps.match.params.id,
        item: index
      });
    }
  })
)(EditList);
