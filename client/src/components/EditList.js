import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import TextField from "material-ui/TextField";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import ActionHistory from "material-ui-icons/History";
import ActionShoppingBasket from "material-ui-icons/ShoppingBasket";
import DragHandle from "material-ui-icons/DragHandle";
import Divider from "material-ui/Divider";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import ContentRemove from "material-ui-icons/Remove";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import { Redirect } from "react-router";
import BottomNavigation, {
  BottomNavigationButton
} from "material-ui/BottomNavigation";

import redirectToLogin from "./RedirectToLogin";
import removeFromProps from "./RemoveFromProps";

const BottomNavigationLink = removeFromProps("showLabel")(Link);

const SortableDragHandle = SortableHandle(() => <DragHandle />);

const SortableItem = SortableElement(({ item, onClick, onRemove }) => {
  return (
    <ListItem onClick={onClick} button>
      <ListItemIcon>
        <SortableDragHandle />
      </ListItemIcon>
      <ListItemText primary={item.name} />
      <ListItemIcon onClick={onRemove}>
        <ContentRemove />
      </ListItemIcon>
    </ListItem>
  );
});

const SortableList = SortableContainer(({ items, onClick, onRemove }) => {
  return (
    <List>
      {items.map((item, index) => (
        <SortableItem
          key={item.uid}
          index={index}
          onClick={() => onClick(item)}
          onRemove={e => {
            e.stopPropagation();
            onRemove(item);
          }}
          item={item}
        />
      ))}
    </List>
  );
});

export class EditList extends Component {
  state = {
    addText: "",
    dialogId: null
  };
  onRequestAdd = () => {
    this.setState({ addMode: true });
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
  handleDialogClose = () => {
    this.setState({ dialogId: null });
  };
  onItemClick = item => {
    this.setState({ dialogId: item.uid, dialogText: item.name });
  };
  onChangeDialogText = e => {
    this.setState({
      dialogText: e.target.value
    });
  };
  onRemoveItem = item => {
    this.props.onToggle(item.uid);
  };
  handleChangeItem = e => {
    e.preventDefault();
    this.props.onChangeItem(this.state.dialogId, this.state.dialogText);
    this.setState({ dialogId: null, dialogText: "" });
  };
  render() {
    if (!this.props.uid) return <Redirect to="/" />;
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link to={`/lists/${this.props.match.params.id}`}>
              <IconButton color="inherit">
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography type="title" color="inherit" style={{ flex: 1 }}>
              {this.props.name} editieren
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={this.onAdd} style={{ margin: "10px" }}>
          <TextField
            fullWidth
            autoFocus
            key="add-textfield"
            value={this.state.addText}
            onChange={this.onChangeAddText}
            placeholder="Neuer Eintrag"
          />
        </form>

        <SortableList
          items={this.props.activeItems}
          onSortEnd={this.onSortEndActive}
          onClick={this.onItemClick}
          onRemove={this.onRemoveItem}
          useDragHandle
        />
        {this.props.doneItems.length > 0 && <Divider inset={true} />}
        {this.props.doneItems.length > 0 && (
          <Button style={{ fontSize: "0.7em" }} onClick={this.props.onRemove}>
            Erledigte Löschen
          </Button>
        )}
        <List style={{ paddingBottom: "65px" }}>
          {this.props.doneItems.map((item, index) => (
            <ListItem
              button
              style={{ color: "#aaa" }}
              key={index}
              onClick={() => this.onToggle(item)}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <Paper
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            left: "10px"
          }}
          elevation={1}
        >
          <BottomNavigation>
            <BottomNavigationLink
              to={`/lists/${this.props.uid}/edit/last-used`}
            >
              <BottomNavigationButton
                showLabel
                label="Zuletzt verwendet"
                icon={<ActionHistory />}
              />
            </BottomNavigationLink>
            <BottomNavigationLink
              to={`/lists/${this.props.uid}/edit/categories`}
            >
              <BottomNavigationButton
                showLabel
                label="Kategorien"
                icon={<ActionShoppingBasket />}
              />
            </BottomNavigationLink>
          </BottomNavigation>
        </Paper>
        <Dialog
          open={this.state.dialogId !== null}
          onRequestClose={this.handleDialogClose}
        >
          <DialogContent>
            <form onSubmit={this.handleChangeItem}>
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
            <Button label="Abbrechen" onClick={this.handleDialogClose}>
              Abbrechen
            </Button>
            <Button color="primary" onClick={this.handleChangeItem}>
              Speichern
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export const ConnectedEditList = redirectToLogin(
  connect(
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
      onChangeItem: (item, name) => {
        dispatch({
          type: "EDIT_ITEM",
          list: ownProps.match.params.id,
          item,
          name
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
  )(EditList)
);
