import React from "react";
import { Link } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Add from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import { Logo } from "../components/Logo";
import buildSelector, { lists, merged } from "../redux/selectors";
import ListIcon, { filterLeadingEmoji } from "../components/ListIcon";
import ListMenu from "../components/ListMenu";
import ChangeNameDialog from "../components/ChangeNameDialog";
import addDialog from "../components/AddDialog";
import Drawer from "../components/Drawer";
import drawerToggle from "../components/DrawerToggle";
import routerContext from "../components/RouterContext";
import moveObject from "../components/MoveObject";
import buildHandlers, {
  addList,
  moveList,
  refresh
} from "../redux/actions";

const SortableDragHandle = SortableHandle(({ name }) => (
  <ListIcon name={name} />
));

const SortableItem = compose(
  SortableElement,
  withHandlers({
    goToSettings: ({ history, list: { uid: listId } }) => e => {
      e.preventDefault();
      history.push(`/lists/${listId}/edit`);
    }
  })
)(({ list, history, goToSettings }) => {
  return (
    <ListItem button tabIndex={-1}>
      <ListItemIcon>
        <SortableDragHandle name={list.name} />
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
        <ListItemSecondaryAction>
          <ListMenu list={list} />
        </ListItemSecondaryAction>
      </Link>
    </ListItem>
  );
});

const SortableList = SortableContainer(({ lists, history }) => {
  return (
    <List>
      {lists.map((list, index) => (
        <SortableItem
          key={list.uid}
          index={index}
          history={history}
          list={list}
        />
      ))}
    </List>
  );
});

export const Lists = ({
  lists,
  isDialogOpen,
  handleDialogOpen,
  handleDialogClose,
  handleDialogSubmit,
  router,
  toggleDrawer,
  isDrawerOpen,
  merged,
  onSortEnd,
  refresh
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          style={{ marginLeft: -12, marginRight: 10, color: "white" }}
          color="default"
          aria-label="Menu"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Logo onClick={refresh} inverted showSyncMarker={!merged} />
        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
          Alle Listen
        </Typography>
        <IconButton
          onClick={handleDialogOpen}
          aria-label="Liste hinzufügen"
          color="inherit"
        >
          <Add />
        </IconButton>
      </Toolbar>
    </AppBar>
    <SortableList
      lists={lists}
      onSortEnd={onSortEnd}
      history={router.history}
      useDragHandle
      useWindowAsScrollContainer
      lockAxis="y"
    />
    {lists.length === 0 &&
      merged && (
        <Paper style={{ padding: "20px" }} elevation={2}>
          <Typography>
            Noch keine Listen angelegt.<br />
            Tippe rechts oben "+", um eine Liste hinzuzufügen.<br />
            <br />
            Einträge können über mehrere Geräte synchronisiert werden.<br />
            Öffne Links oben das Menü, um den Sync-Code zu kopieren.
          </Typography>
        </Paper>
      )}
    {lists.length === 0 &&
      !merged && (
        <CircularProgress
          style={{
            margin: "0 auto",
            display: "block",
            marginTop: 50
          }}
          size={80}
          thickness={4}
        />
      )}
    {isDialogOpen && (
      <ChangeNameDialog
        initialText=""
        onSubmit={handleDialogSubmit}
        onClose={handleDialogClose}
      />
    )}
    <Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
  </div>
);

export default compose(
  redirectToLogin,
  connect(
    buildSelector({
      lists,
      merged
    }),
    buildHandlers({
      addList,
      moveList,
      refresh
    })
  ),
  routerContext,
  addDialog("addList"),
  moveObject("moveList", (props, index) => props.lists[index].uid),
  drawerToggle
)(Lists);
