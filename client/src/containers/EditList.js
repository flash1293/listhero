import React from "react";
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
import DragHandle from "material-ui-icons/DragHandle";
import Divider from "material-ui/Divider";
import ContentRemove from "material-ui-icons/Remove";
import Add from "material-ui-icons/Add";
import { connect } from "react-redux";
import compose from "ramda/src/compose";
import { withHandlers } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import ChangeNameDialog from "../components/ChangeNameDialog";
import AddItemNavigation from "../components/AddItemNavigation";
import AddForm from "../components/AddForm";
import moveObject from "../components/MoveObject";
import editDialog from "../components/EditDialog";
import buildHandlers, {
  toggleItem,
  addItem,
  increaseItem,
  decreaseItem,
  removeDoneItems,
  editItem,
  moveItem
} from "../redux/actions";
import buildSelector, {
  list,
  doneItems,
  activeItems
} from "../redux/selectors";

const SortableDragHandle = SortableHandle(() => <DragHandle />);

const SortableItem = SortableElement(
  withHandlers(() => ({
    onRemove: ({ onRemove, item }) => e => {
      e.stopPropagation();
      onRemove(item);
    },
    onIncrease: ({ onIncrease, item }) => e => {
      e.stopPropagation();
      onIncrease(item);
    },
    onDecrease: ({ onDecrease, item }) => e => {
      e.stopPropagation();
      onDecrease(item);
    },
    onClick: ({ onClick, item }) => () => onClick(item)
  }))(({ item, onRemove, onIncrease, onDecrease, onClick }) => {
    return (
      <ListItem onClick={onClick} button>
        <ListItemIcon>
          <SortableDragHandle />
        </ListItemIcon>
        <ListItemText primary={item.name} />
        <ListItemIcon onClick={onIncrease}>
          <Add />
        </ListItemIcon>
        <ListItemIcon onClick={item.stacked ? onDecrease : onRemove}>
          <ContentRemove />
        </ListItemIcon>
      </ListItem>
    );
  })
);

const SortableList = SortableContainer(
  ({ items, onClick, onIncrease, onDecrease, onRemove }) => {
    return (
      <List>
        {items.map((item, index) => (
          <SortableItem
            key={item.uid}
            index={index}
            onClick={onClick}
            onRemove={onRemove}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            item={item}
          />
        ))}
      </List>
    );
  }
);

export const EditList = ({
  list: { name },
  listId,
  addItem,
  activeItems,
  onSortEnd,
  handleDialogOpen,
  toggleItem,
  increaseItem,
  decreaseItem,
  doneItems,
  removeDoneItems,
  dialogItem,
  handleDialogClose,
  handleDialogSubmit
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to={`/lists/${listId}`}>
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {name} editieren
        </Typography>
      </Toolbar>
    </AppBar>
    <AddForm placeholder="Neuer Eintrag" onSubmit={addItem} />
    <SortableList
      items={activeItems}
      onSortEnd={onSortEnd}
      onClick={handleDialogOpen}
      onRemove={toggleItem}
      onDecrease={decreaseItem}
      onIncrease={increaseItem}
      useDragHandle
    />
    {doneItems.length > 0 && <Divider inset={true} />}
    {doneItems.length > 0 && (
      <Button style={{ fontSize: "0.7em" }} onClick={removeDoneItems}>
        Erledigte Löschen
      </Button>
    )}
    <List style={{ paddingBottom: "65px" }}>
      {doneItems.map((item, index) => (
        <ListItem
          button
          style={{ color: "#aaa" }}
          key={item.uid}
          onClick={() => toggleItem(item)}
        >
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
    <AddItemNavigation uid={listId} />
    {dialogItem && (
      <ChangeNameDialog
        initialText={dialogItem.name}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    )}
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(
    buildSelector({
      list,
      doneItems,
      activeItems
    }),
    buildHandlers({
      addItem,
      removeDoneItems,
      editItem,
      moveItem,
      increaseItem,
      decreaseItem,
      toggleItem
    })
  ),
  redirectToHome,
  editDialog("Item", "editItem"),
  moveObject("moveItem", (props, index) => props.activeItems[index].uid)
)(EditList);
