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
import ArrowBack from "material-ui-icons/ArrowBack";
import DragHandle from "material-ui-icons/DragHandle";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import { connect } from "react-redux";
import { compose } from "redux";
import { withHandlers } from "recompose";

import redirectToLogin from "../components/RedirectToLogin";
import ChangeNameDialog from "../components/ChangeNameDialog";
import moveObject from "../components/MoveObject";
import AddForm from "../components/AddForm";
import editDialog from "../components/EditDialog";
import buildHandlers, {
  addList,
  removeList,
  editList,
  moveList
} from "../redux/actions";
import buildSelector, { lists } from "../redux/selectors";

const SortableDragHandle = SortableHandle(() => (
  <DragHandle style={{ float: "left", marginRight: "10px" }} />
));

const SortableItem = SortableElement(
  withHandlers(({ list, onRemove, onEdit }) => ({
    onRemove: ({ onRemove, list }) => () => onRemove(list),
    onEdit: ({ list, onEdit }) => () => onEdit(list)
  }))(({ list, onRemove, onEdit }) => {
    return (
      <ListItem key={list.uid}>
        <ListItemIcon>
          <IconButton>
            <SortableDragHandle />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={list.name} />
        <ListItemIcon>
          <IconButton onClick={onRemove}>
            <Delete />
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          <IconButton onClick={onEdit}>
            <Edit />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    );
  })
);

const SortableList = SortableContainer(({ lists, onRemove, onEdit }) => {
  return (
    <List>
      {lists.map((list, index) => (
        <SortableItem
          key={list.uid}
          index={index}
          onRemove={() => onRemove(list)}
          onEdit={() => onEdit(list)}
          list={list}
        />
      ))}
    </List>
  );
});

export const ListsEdit = ({
  addList,
  lists,
  removeList,
  handleDialogOpen,
  onSortEnd,
  dialogList,
  handleDialogClose,
  handleDialogSubmit
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
          Listen editieren
        </Typography>
      </Toolbar>
    </AppBar>
    <AddForm placeholder="Neue Liste" onSubmit={addList} />
    <SortableList
      lists={lists}
      onRemove={removeList}
      onEdit={handleDialogOpen}
      onSortEnd={onSortEnd}
      useDragHandle
      useWindowAsScrollContainer
      lockAxis="y"
    />
    {dialogList && (
      <ChangeNameDialog
        initialText={dialogList.name}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
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
      removeList,
      moveList,
      editList
    })
  ),
  editDialog("List", "editList"),
  moveObject("moveList", (props, index) => props.lists[index].uid)
)(ListsEdit);
