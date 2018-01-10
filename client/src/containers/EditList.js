import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import IconButton from "material-ui/IconButton";
import ArrowBack from "material-ui-icons/ArrowBack";
import DragHandle from "material-ui-icons/DragHandle";
import ContentRemove from "material-ui-icons/Remove";
import Add from "material-ui-icons/Add";
import { connect } from "react-redux";
import compose from "ramda/src/compose";
import { withHandlers } from "recompose";
import { I18n } from "react-i18next";

import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import routeParam from "../components/RouteParam";
import ChangeNameDialog from "../components/ChangeNameDialog";
import AddItemNavigation from "../components/AddItemNavigation";
import AddForm from "../components/AddForm";
import ListMenu from "../components/ListMenu";
import moveObject from "../components/MoveObject";
import editDialog from "../components/EditDialog";
import buildHandlers, {
  removeItem,
  addItem,
  increaseItem,
  decreaseItem,
  editItem,
  moveItem
} from "../redux/actions";
import buildSelector, { list } from "../redux/selectors";

const SortableDragHandle = SortableHandle(() => <DragHandle />);

const SortableItem = compose(
  SortableElement,
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
  }))
)(({ item, onRemove, onIncrease, onDecrease, onClick }) => {
  return (
    <ListItem
      style={item.marker ? { backgroundColor: "#eee" } : undefined}
      onClick={item.marker ? undefined : onClick}
      button={!item.marker}
    >
      {!item.marker && (
        <ListItemIcon>
          <SortableDragHandle />
        </ListItemIcon>
      )}
      {item.label ? (
        <I18n>{t => <ListItemText primary={t(item.label)} />}</I18n>
      ) : (
        <ListItemText primary={item.name} />
      )}
      {!item.marker && (
        <React.Fragment>
          <ListItemIcon onClick={onIncrease}>
            <Add />
          </ListItemIcon>
          <ListItemIcon onClick={item.stacked ? onDecrease : onRemove}>
            <ContentRemove />
          </ListItemIcon>
        </React.Fragment>
      )}
    </ListItem>
  );
});

const SortableList = SortableContainer(
  ({ items, onClick, onIncrease, onDecrease, onRemove }) => {
    return (
      <List style={{ marginBottom: 60 }}>
        {items.map((item, index) => (
          <SortableItem
            key={item.uid ? item.uid : item.label}
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
  list,
  listId,
  addItem,
  onSortEnd,
  handleDialogOpen,
  removeItem,
  increaseItem,
  decreaseItem,
  dialogItem,
  handleDialogClose,
  handleDialogSubmit
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to={`/lists/${listId}/entries`}>
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {list.name} editieren
        </Typography>
        <ListMenu list={list} />
      </Toolbar>
    </AppBar>
    <AddForm
      placeholder="Neuer Eintrag"
      recentItems={list.recentItems}
      listId={listId}
      onSubmit={addItem}
    />
    <SortableList
      items={list.items}
      onSortEnd={onSortEnd}
      onClick={handleDialogOpen}
      onRemove={removeItem}
      onDecrease={decreaseItem}
      onIncrease={increaseItem}
      useDragHandle
      useWindowAsScrollContainer
      lockAxis="y"
    />
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
      list
    }),
    buildHandlers({
      addItem,
      editItem,
      moveItem,
      increaseItem,
      decreaseItem,
      removeItem
    })
  ),
  redirectToHome,
  editDialog("Item", "editItem"),
  moveObject("moveItem", (props, index) => props.list.items[index].uid)
)(EditList);
