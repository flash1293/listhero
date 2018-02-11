import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Edit from "material-ui-icons/Edit";
import DoneAll from "material-ui-icons/DoneAll";
import ArrowBack from "material-ui-icons/ArrowBack";
import { connect } from "react-redux";
import { compose } from "redux";
import LongPress from "react-long";
import { withHandlers } from "recompose";
import { I18n } from "react-i18next";
import windowSize from "react-window-size";
import Eye from "material-ui-icons/RemoveRedEye";
import routerContext from "../components/RouterContext";
import { Shortcuts } from "react-shortcuts";

import ListIcon, { filterLeadingEmoji } from "../components/ListIcon";
import editDialog from "../components/EditDialog";
import preferredView from "../components/PreferredView";
import ContextDialog from "../components/ContextDialog";
import redirectToLogin from "../components/RedirectToLogin";
import redirectToHome from "../components/RedirectToHome";
import ListMenu from "../components/ListMenu";
import AddItemNavigation from "../components/AddItemNavigation";
import removeAnimation from "../components/RemoveAnimation";
import routeParam from "../components/RouteParam";
import buildHandlers, {
  removeItem,
  moveItemToBottom,
  setPreferredView
} from "../redux/actions";
import buildSelector, { list, lists, filteredItems } from "../redux/selectors";

const labelColor = label =>
  label === `weekday_${new Date().getDay() - 1}` ? "#bbb" : "#eee";

// touch-support feature detection
let touchSupport = true;
try {
  document.createEvent("TouchEvent");
} catch (e) {
  touchSupport = false;
}

const ViewListItem = compose(
  withHandlers({
    handleRemove: ownProps => () => ownProps.removeItem(ownProps.item),
    handleContextMenu: ownProps => () =>
      ownProps.handleContextMenu(ownProps.item)
  }),
  removeAnimation("handleRemove")
)(({ item, onRemoveDelayed, hideClassName, handleContextMenu }) => {
  const element = (
    <ListItem
      style={
        item.marker
          ? {
              backgroundColor: labelColor(item.label),
              paddingTop: 5,
              paddingBottom: 5
            }
          : undefined
      }
      button={!item.marker}
      onClick={item.marker ? undefined : onRemoveDelayed}
    >
      {item.label ? (
        <I18n>{t => <ListItemText secondary={t(item.label)} />}</I18n>
      ) : (
        <ListItemText primary={item.name} className={hideClassName} />
      )}
    </ListItem>
  );

  return touchSupport ? (
    <LongPress time={1000} onLongPress={handleContextMenu}>
      {element}
    </LongPress>
  ) : (
    element
  );
});

const ItemContextDialog = withHandlers({
  handleRemove: ownProps => () => {
    ownProps.removeItem(ownProps.item);
    ownProps.onClose();
  },
  handleSendToBottom: ownProps => () => {
    ownProps.moveToBottom(ownProps.item);
    ownProps.onClose();
  }
})(({ item, handleSendToBottom, handleRemove, onClose }) => (
  <ContextDialog onClose={onClose}>
    <ListItem button onClick={handleSendToBottom}>
      <ListItemText primary="Nach unten verschieben" />
    </ListItem>
    <ListItem button onClick={handleRemove}>
      <ListItemText primary="Abhaken" />
    </ListItem>
  </ContextDialog>
));

export const ViewList = ({
  list,
  filteredItems: items,
  lists,
  listId,
  removeItem,
  moveItemToBottom,
  dialogItem,
  handleDialogOpen,
  handleDialogClose,
  windowWidth,
  handleShortcuts
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Shortcuts
        name="SHOPPING_VIEW"
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
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          {list.name}
        </Typography>
        <Link
          style={{
            color: "rgba(255,255,255,0.4)"
          }}
          tabIndex={-1}
          to={`/lists/${listId}/entries`}
        >
          <IconButton
            tabIndex={-1}
            color="inherit"
            aria-label="Einkaufs-Ansicht"
          >
            <Eye />
          </IconButton>
        </Link>
        <Link tabIndex={-1} to={`/lists/${listId}/entries/edit`}>
          <IconButton aria-label="Editieren" color="inherit">
            <Edit />
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
      <div
        style={{
          marginBottom: 60,
          flex: "5 1 auto",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {items.length > 0 ? (
          <List style={{ marginBottom: 60 }}>
            {items.map(
              (item, index) =>
                item.isDivider ? (
                  <Divider key={`divider-${index}`} />
                ) : (
                  <ViewListItem
                    item={item}
                    key={item.uid ? item.uid : item.label}
                    removeItem={removeItem}
                    handleContextMenu={handleDialogOpen}
                  />
                )
            )}
          </List>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#aaa",
              marginTop: "50px"
            }}
          >
            <DoneAll />
            <Typography color="inherit">Alles erledigt!</Typography>
          </div>
        )}
      </div>
    </div>
    <AddItemNavigation uid={listId} />
    {dialogItem && (
      <ItemContextDialog
        item={dialogItem}
        onClose={handleDialogClose}
        removeItem={removeItem}
        moveToBottom={moveItemToBottom}
      />
    )}
  </div>
);

export default compose(
  redirectToLogin,
  routeParam("id", "listId"),
  connect(
    buildSelector({ lists, list, filteredItems }),
    buildHandlers({
      removeItem,
      moveItemToBottom,
      setPreferredView
    })
  ),
  editDialog("Item"),
  redirectToHome,
  windowSize,
  preferredView("shop"),
  routerContext,
  withHandlers({
    handleShortcuts: ({ router: { history }, listId, lists }) => action => {
      switch (action) {
        case "EDIT_MODE":
          history.push(`/lists/${listId}/entries/edit`);
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
  })
)(ViewList);
