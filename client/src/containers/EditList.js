import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
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
import ContentRemove from "material-ui-icons/Remove";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import { Redirect } from "react-router";
import BottomNavigation, {
  BottomNavigationButton
} from "material-ui/BottomNavigation";

import redirectToLogin from "../components/RedirectToLogin";
import removeFromProps from "../components/RemoveFromProps";
import ChangeNameDialog from "../components/ChangeNameDialog";
import AddForm from "../components/AddForm";

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
    dialogItem: null
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
    this.setState({ dialogItem: null });
  };
  onItemClick = item => {
    this.setState({ dialogItem: item });
  };
  onRemoveItem = item => {
    this.props.onToggle(item.uid);
  };
  handleChangeItem = text => {
    this.props.onChangeItem(this.state.dialogItem.uid, text);
    this.setState({ dialogItem: null });
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
        <AddForm placeholder="Neuer Eintrag" onSubmit={this.props.onAdd} />
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
        {this.state.dialogItem && (
          <ChangeNameDialog
            initialText={this.state.dialogItem.name}
            onClose={this.handleDialogClose}
            onSubmit={this.handleChangeItem}
          />
        )}
      </div>
    );
  }
}

export default redirectToLogin(
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
