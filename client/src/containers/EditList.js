import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import DragHandle from "@material-ui/icons/DragHandle";
import ContentRemove from "@material-ui/icons/Remove";
import Eye from "@material-ui/icons/RemoveRedEye";
import Add from "@material-ui/icons/Add";
import { connect } from "react-redux";
import compose from "ramda/src/compose";
import { withHandlers, pure, mapProps } from "recompose";
import { I18n } from "react-i18next";
import windowSize from "react-window-size";
import { Shortcuts } from "react-shortcuts";
import routerContext from "../components/RouterContext";

import preferredView from "../components/PreferredView";
import ListIcon, { filterLeadingEmoji } from "../components/ListIcon";
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
  moveItem,
  setPreferredView,
  changeEnteredText
} from "../redux/actions";
import buildSelector, { list, lists } from "../redux/selectors";

const SortableDragHandle = SortableHandle(() => (
  <DragHandle
    style={{
      paddingLeft: 16,
      paddingTop: 12,
      paddingBottom: 12
    }}
  />
));

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
    onMoveUp: ({ onMove, item, itemIndex }) => () =>
      itemIndex > 0 && onMove(item.uid, itemIndex - 1),
    onMoveDown: ({ onMove, item, itemIndex }) => () =>
      onMove(item.uid, itemIndex + 1),
    onClick: ({ onClick, item }) => () => onClick(item)
  })),
  withHandlers(() => ({
    handleShortcuts: ({
      item,
      onIncrease,
      onDecrease,
      onRemove,
      onClick,
      onMoveUp,
      onMoveDown
    }) => (action, event) => {
      switch (action) {
        case "MOVE_UP":
          onMoveUp();
          break;
        case "MOVE_DOWN":
          onMoveDown();
          break;
        case "INCREMENT":
          onIncrease(event);
          break;
        case "EDIT":
          event.stopPropagation();
          event.preventDefault();
          onClick(item);
          break;
        case "DECREMENT":
          item.stacked ? onDecrease(event) : onRemove(event);
          break;
        default:
          break;
      }
    }
  })),
  mapProps(({ key, index, itemIndex, ...other }) => other),
  pure
)(({ item, onRemove, onIncrease, onDecrease, handleShortcuts, onClick }) => {
  return (
    <Shortcuts
      tabIndex={0}
      stopPropagation={false}
      name="TODO_ITEM"
      handler={handleShortcuts}
    >
      <ListItem
        ref={el => {
          window.el = el;
        }}
        style={
          item.marker
            ? { backgroundColor: "#eee" }
            : { padding: 0, wordBreak: "break-word" }
        }
        onClick={item.marker ? undefined : onClick}
        button={!item.marker}
        tabIndex={-1}
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
            <ListItemIcon tabIndex="-1" onClick={onIncrease}>
              <IconButton
                style={{
                  height: 48,
                  width: 30
                }}
              >
                <Add />
              </IconButton>
            </ListItemIcon>
            <ListItemIcon
              tabIndex="-1"
              onClick={item.stacked ? onDecrease : onRemove}
            >
              <IconButton
                style={{
                  height: 48,
                  width: 30
                }}
              >
                <ContentRemove />
              </IconButton>
            </ListItemIcon>
          </React.Fragment>
        )}
      </ListItem>
    </Shortcuts>
  );
});

const SortableList = pure(
  SortableContainer(
    ({
      items,
      onClick,
      onIncrease,
      onDecrease,
      onRemove,
      onSortEnd,
      onMove
    }) => {
      return (
        <List style={{ marginBottom: 60 }}>
          {items.map((item, index) => (
            <SortableItem
              key={item.uid ? item.uid : item.label}
              index={index}
              itemIndex={index}
              onClick={onClick}
              onRemove={onRemove}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onMove={onMove}
              item={item}
            />
          ))}
        </List>
      );
    }
  )
);

export const EditList = ({
  list,
  listId,
  addItem,
  onSortEnd,
  handleDialogOpen,
  removeItem,
  moveItem,
  increaseItem,
  decreaseItem,
  changeEnteredText,
  dialogItem,
  handleDialogClose,
  handleDialogSubmit,
  windowWidth,
  handleShortcuts,
  lists
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Shortcuts
        name="EDIT_VIEW"
        stopPropagation={false}
        targetNodeSelector="body"
        handler={handleShortcuts}
      />
      <Toolbar>
        <Link tabIndex={-1} to="/">
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="title" color="inherit" style={{ flex: 1 }}>
          {list.name}
        </Typography>
        <Link tabIndex={-1} to={`/lists/${listId}/entries`}>
          <IconButton color="inherit" aria-label="Einkaufs-Ansicht">
            <Eye />
          </IconButton>
        </Link>
        <ListMenu list={list} />
      </Toolbar>
    </AppBar>
    <div
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      {windowWidth > 700 &&
        lists.length > 1 && (
          <List
            style={{
              flex: "1 1 auto",
              boxShadow: "inset 0 0 25px rgba(0,0,0,0.3)",
              backgroundColor: "#f5f5f5",
              minHeight: "calc(100vh - 80px)"
            }}
          >
            {lists.map((list, index) => (
              <ListItem
                key={list.uid}
                tabIndex={-1}
                button
                style={list.uid === listId ? { backgroundColor: "#bbb" } : {}}
              >
                <ListItemIcon>
                  <ListIcon name={list.name} />
                </ListItemIcon>
                <Link
                  style={{
                    flex: 1,
                    paddingLeft: 15,
                    marginTop: "-12px",
                    marginBottom: "-12px",
                    paddingTop: 12,
                    paddingBottom: 12
                  }}
                  to={`/lists/${list.uid}/entries${
                    list.preferredView === "edit" ? "/edit" : ""
                  }`}
                >
                  <ListItemText
                    primary={filterLeadingEmoji(list.name)}
                    secondary={`${list.itemCount} Einträge `}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      <div style={{ flex: "5 1 0", position: "relative" }}>
        <AddForm
          placeholder="Neuer Eintrag"
          recentItems={list.recentItems}
          listId={listId}
          onSubmit={addItem}
          onChange={changeEnteredText}
          initialText={list.enteredText}
        />
        <SortableList
          items={list.items}
          onSortEnd={onSortEnd}
          onMove={moveItem}
          onClick={handleDialogOpen}
          onRemove={removeItem}
          onDecrease={decreaseItem}
          onIncrease={increaseItem}
          useDragHandle
          useWindowAsScrollContainer
          lockAxis="y"
        />
      </div>
    </div>
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
      lists
    }),
    buildHandlers({
      addItem,
      editItem,
      moveItem,
      increaseItem,
      decreaseItem,
      changeEnteredText,
      removeItem,
      setPreferredView
    })
  ),
  redirectToHome,
  editDialog("Item", "editItem"),
  moveObject("moveItem", (props, index) => props.list.items[index].uid),
  windowSize,
  routerContext,
  withHandlers({
    handleShortcuts: ({ router: { history }, listId, lists }) => action => {
      switch (action) {
        case "SHOPPING_MODE":
          history.push(`/lists/${listId}/entries`);
          break;
        case "NEXT_LIST":
          const nextList = lists[lists.findIndex(l => l.uid === listId) + 1];
          if (nextList) {
            history.push(
              `/lists/${nextList.uid}/entries${
                nextList.preferredView === "edit" ? "/edit" : ""
              }`
            );
          }
          break;
        case "PREVIOUS_LIST":
          const previousList =
            lists[lists.findIndex(l => l.uid === listId) - 1];
          if (previousList) {
            history.push(
              `/lists/${previousList.uid}/entries${
                previousList.preferredView === "edit" ? "/edit" : ""
              }`
            );
          }
          break;
        default:
          break;
      }
    }
  }),
  preferredView("edit")
)(EditList);
