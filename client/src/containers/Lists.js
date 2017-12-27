import React from "react";
import { Link } from "react-router-dom";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Add from "material-ui-icons/Add";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import { Logo } from "../components/Logo";
import buildSelector, { lists } from "../redux/selectors";
import ListIcon, { filterLeadingEmoji } from "../components/ListIcon";
import ListMenu from "../components/ListMenu";
import ChangeNameDialog from "../components/ChangeNameDialog";
import addDialog from "../components/AddDialog";
import routerContext from "../components/RouterContext";
import moveObject from "../components/MoveObject";
import buildHandlers, { addList, moveList } from "../redux/actions";
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";

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
    <ListItem button>
      <ListItemIcon>
        <SortableDragHandle name={list.name} />
      </ListItemIcon>
      <Link
        style={{ flex: 1, paddingLeft: 15 }}
        to={`/lists/${list.uid}/entries`}
      >
        <ListItemText
          primary={filterLeadingEmoji(list.name)}
          secondary={`${list.items.length} Einträge `}
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
  onSortEnd
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Logo inverted />
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
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
    {lists.length === 0 && (
      <Paper style={{ padding: "20px" }} elevation={2}>
        <Typography>
          Noch keine Listen angelegt.<br />Tippe rechts oben "+", um eine Liste
          hinzuzufügen.
        </Typography>
      </Paper>
    )}
    {isDialogOpen && (
      <ChangeNameDialog
        initialText=""
        onSubmit={handleDialogSubmit}
        onClose={handleDialogClose}
      />
    )}
  </div>
);

export default compose(
  redirectToLogin,
  connect(
    buildSelector({
      lists
    }),
    buildHandlers({
      addList,
      moveList
    })
  ),
  routerContext,
  addDialog("addList"),
  moveObject("moveList", (props, index) => props.lists[index].uid)
)(Lists);
