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
import Edit from "material-ui-icons/Edit";
import ContentRemove from "material-ui-icons/Remove";
import Eye from "material-ui-icons/RemoveRedEye";
import Add from "material-ui-icons/Add";
import { connect } from "react-redux";
import compose from "ramda/src/compose";
import { withHandlers } from "recompose";
import { I18n } from "react-i18next";
import ActionShoppingBasket from "material-ui-icons/ShoppingBasket";
import windowSize from "react-window-size";

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
  setPreferredView
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
    onClick: ({ onClick, item }) => () => onClick(item)
  }))
)(({ item, onRemove, onIncrease, onDecrease, onClick }) => {
  return (
    <ListItem
      style={item.marker ? { backgroundColor: "#eee" } : { padding: 0 }}
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
            <IconButton
              style={{
                height: 48,
                width: 30
              }}
            >
              <Add />
            </IconButton>
          </ListItemIcon>
          <ListItemIcon onClick={item.stacked ? onDecrease : onRemove}>
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
  handleDialogSubmit,
  windowWidth,
  lists
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to="/">
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {list.name} editieren
        </Typography>
        <Link
          style={{
            borderLeft: "1px solid white",
            borderTop: "1px solid white",
            borderBottom: "1px solid white",
            borderRadius: "10px 0 0 10px",
            color: "rgba(255,255,255,0.2)"
          }}
          to={`/lists/${listId}/entries`}
        >
          <IconButton color="inherit" aria-label="Einkaufs-Ansicht">
            <Eye />
          </IconButton>
        </Link>
        <Link
          style={{
            borderRight: "1px solid white",
            borderTop: "1px solid white",
            borderBottom: "1px solid white",
            borderRadius: "0 10px 10px 0"
          }}
          to={`/lists/${listId}/entries/edit`}
        >
          <IconButton aria-label="Editieren" color="inherit">
            <Edit />
          </IconButton>
        </Link>
        <Link to={`/lists/${listId}/entries/categories`}>
          <IconButton color="inherit" aria-label="Kategorien">
            <ActionShoppingBasket />
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
      <div style={{ flex: "5 1 auto" }}>
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
      removeItem,
      setPreferredView
    })
  ),
  redirectToHome,
  editDialog("Item", "editItem"),
  moveObject("moveItem", (props, index) => props.list.items[index].uid),
  windowSize,
  preferredView("edit")
)(EditList);
