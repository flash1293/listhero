import React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import compose from "ramda/src/compose";
import { withState, withHandlers, mapProps } from "recompose";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withRouter } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { translate } from "react-i18next";
import { withSnackbar } from 'notistack';

import buildHandlers, {
  delayedRemoveList,
  editList,
  createWeekplan,
  createNormalList,
  clearList
} from "../redux/actions";
import ChangeNameDialog from "../components/ChangeNameDialog";
import editDialog from "../components/EditDialog";
import Divider from "@material-ui/core/Divider/Divider";

export default compose(
  connect(
    () => ({}),
    buildHandlers({
      editList,
      delayedRemoveList,
      clearList,
      createWeekplan,
      createNormalList
    })
  ),
  editDialog("List", "editList"),
  withState("anchorEl", "setAnchorEl", null),
  withState("isOpen", "setOpen", false),
  withRouter,
  withSnackbar,
  translate("translations"),
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
    handleRemove: ({ t, enqueueSnackbar, delayedRemoveList, setOpen, list }) => () => {
      setOpen(false);
      const [flushRemoval, cancelRemoval] = delayedRemoveList(list);
      enqueueSnackbar(`${list.name} ${t("snackbar_listremove_label")}`, {
        variant: 'default',
        action: <Button onClick={cancelRemoval} color="secondary" size="small">{t("snackbar_listremove_action")}</Button>,
        onClose: flushRemoval,
        autoHideDuration: 5000
      });
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
    stopPropagation: () => e => {
      e.preventDefault();
      e.stopPropagation();
    }
  }),
  mapProps(props => ({
    ...props,
    listAsText: props.list.items
      .map(item => (item.label ? props.t(item.label) : item.name))
      .join("\n")
  }))
)(
  ({
    anchorEl,
    handleOpen,
    handleClose,
    isOpen,
    list,
    listAsText,
    dialogList,
    handleRemove,
    handleClear,
    handleDialogClose,
    handleDialogSubmit,
    handleDialogOpen,
    handleWeekplan,
    handleNormalList,
    stopPropagation,
    t
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
        <MenuItem onClick={handleDialogOpen}>{t("listmenu_rename")}</MenuItem>
        <MenuItem onClick={handleClear}>{t("listmenu_clear")}</MenuItem>
        <MenuItem onClick={handleRemove}>{t("listmenu_remove")}</MenuItem>
        {!list.isWeekplan && (
          <MenuItem onClick={handleWeekplan}>
            {t("listmenu_toweekplan")}
          </MenuItem>
        )}
        {list.isWeekplan && (
          <MenuItem onClick={handleNormalList}>{t("listmenu_tolist")}</MenuItem>
        )}
        <Divider />
        <CopyToClipboard text={listAsText}>
          <MenuItem>{t("listmenu_copy")}</MenuItem>
        </CopyToClipboard>
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
