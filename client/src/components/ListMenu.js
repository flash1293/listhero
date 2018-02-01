import React from "react";
import { Link } from "react-router-dom";
import MoreVertIcon from "material-ui-icons/MoreVert";
import compose from "ramda/src/compose";
import { withState, withHandlers } from "recompose";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
import { withRouter } from "react-router-dom";

import buildHandlers, {
  removeList,
  editList,
  createWeekplan,
  createNormalList,
  clearList
} from "../redux/actions";
import ChangeNameDialog from "../components/ChangeNameDialog";
import editDialog from "../components/EditDialog";
import Divider from "material-ui/Divider/Divider";

export default compose(
  connect(
    () => ({}),
    buildHandlers({
      editList,
      removeList,
      clearList,
      createWeekplan,
      createNormalList
    })
  ),
  editDialog("List", "editList"),
  withState("anchorEl", "setAnchorEl", null),
  withState("isOpen", "setOpen", false),
  withRouter,
  withHandlers({
    handleOpen: ({ setOpen, setAnchorEl }) => e => {
      setAnchorEl(e.currentTarget);
      setOpen(true);
    },
    handleClose: ({ setOpen }) => () => setOpen(false),
    handleDialogOpen: ({ handleDialogOpen, setOpen, list }) => () => {
      setOpen(false);
      handleDialogOpen(list);
    },
    handleRemove: ({ removeList, setOpen, list }) => () => {
      setOpen(false);
      removeList(list);
    },
    handleClear: ({ clearList, setOpen, list }) => () => {
      setOpen(false);
      clearList(list);
    },
    handleWeekplan: ({ createWeekplan, list }) => () => {
      createWeekplan(list);
    },
    handleNormalList: ({ createNormalList, list }) => () => {
      createNormalList(list);
    },
    handleCategoryPage: ({ history, list }) => () =>
      history.push(`/lists/${list.uid}/entries/categories`),
    stopPropagation: () => e => {
      e.preventDefault();
      e.stopPropagation();
    }
  })
)(
  ({
    anchorEl,
    handleOpen,
    handleClose,
    isOpen,
    list,
    dialogList,
    handleRemove,
    handleClear,
    handleDialogClose,
    handleDialogSubmit,
    handleDialogOpen,
    handleWeekplan,
    handleNormalList,
    stopPropagation,
    handleCategoryPage
  }) => (
    <div onClick={stopPropagation}>
      <IconButton
        aria-owns={isOpen ? `menu-${list.uid}` : null}
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit"
      >
        <MoreVertIcon color="inherit" />
      </IconButton>
      <Menu
        id={`menu-${list.uid}`}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={handleDialogOpen}>Umbenennen</MenuItem>
        <MenuItem onClick={handleClear}>Leeren</MenuItem>
        <MenuItem onClick={handleRemove}>Löschen</MenuItem>
        {!list.isWeekplan && (
          <MenuItem onClick={handleWeekplan}>In Wochenplan umwandeln</MenuItem>
        )}
        {list.isWeekplan && (
          <MenuItem onClick={handleNormalList}>
            In Einkaufsliste umwandeln
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleCategoryPage}>Kategorien</MenuItem>
      </Menu>
      {dialogList && (
        <ChangeNameDialog
          initialText={dialogList.name}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  )
);
