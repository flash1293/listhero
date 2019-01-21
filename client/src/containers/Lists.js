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
import { I18n } from "react-i18next";
import intersperse from "ramda/src/intersperse";

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
import buildHandlers, { addList, moveList, refresh } from "../redux/actions";

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
        <I18n>
          {t => (
            <ListItemText
              primary={filterLeadingEmoji(list.name)}
              secondary={`${list.itemCount} ${t("list_entries")}`}
            />
          )}
        </I18n>
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
  <I18n>
    {t => (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              style={{ marginLeft: -12, marginRight: 10, color: "white" }}
              color="default"
              aria-label={t("lists_menu_label")}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Logo onClick={refresh} inverted showSyncMarker={!merged} />
            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
              {t("lists_title")}
            </Typography>
            <IconButton
              onClick={handleDialogOpen}
              aria-label={t("lists_addlist_label")}
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
        {lists.length === 0 && merged && (
          <Paper style={{ padding: "20px" }} elevation={2}>
            <Typography>
              {intersperse(<br />, t("lists_welcome").split("\n"))}
            </Typography>
          </Paper>
        )}
        {lists.length === 0 && !merged && (
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
    )}
  </I18n>
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
