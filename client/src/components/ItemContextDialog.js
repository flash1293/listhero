import React from "react";
import { compose } from "redux";
import { withHandlers, withState } from "recompose";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import BackIcon from "@material-ui/icons/ChevronLeft";
import MoveToBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import DoneIcon from "@material-ui/icons/Done";
import MoveToListIcon from "@material-ui/icons/CompareArrows";
import { I18n } from "react-i18next";

import ListIcon, { filterLeadingEmoji } from "../components/ListIcon";
import ContextDialog from "../components/ContextDialog";

export default compose(
  withState("selectListToMoveTo", "setSelectListToMoveTo", false),
  withHandlers({
    handleRemove: ownProps => () => {
      ownProps.removeItem(ownProps.item);
      ownProps.onClose();
    },
    handleSendToBottom: ownProps => () => {
      ownProps.moveToBottom(ownProps.item);
      ownProps.onClose();
    },
    handleMoveToList: ownProps => newList => {
      ownProps.moveToList(ownProps.item.uid, newList);
      ownProps.onClose();
    },
    openListList: ownProps => () => ownProps.setSelectListToMoveTo(true),
    closeListList: ownProps => () => ownProps.setSelectListToMoveTo(false)
  })
)(
  ({
    selectListToMoveTo,
    openListList,
    closeListList,
    handleSendToBottom,
    handleRemove,
    onClose,
    lists,
    currentListId,
    handleMoveToList
  }) => (
    <I18n>
      {t => (
        <ContextDialog onClose={onClose}>
          {selectListToMoveTo ? (
            <React.Fragment>
              <ListItem button onClick={closeListList}>
                <ListItemIcon>
                  <BackIcon />
                </ListItemIcon>
                <ListItemText primary={t("itemmenu_moveto_back")} />
              </ListItem>
              {lists
                .filter(list => list.uid !== currentListId)
                .map(({ uid, name }) => (
                  <ListItem
                    key={uid}
                    button
                    onClick={() => handleMoveToList(uid)}
                  >
                    <ListItemIcon>
                      <ListIcon style={{ marginRight: "16px" }} name={name} />
                    </ListItemIcon>
                    <ListItemText primary={filterLeadingEmoji(name)} />
                  </ListItem>
                ))}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ListItem button onClick={handleSendToBottom}>
                <ListItemIcon>
                  <MoveToBottomIcon />
                </ListItemIcon>
                <ListItemText primary={t("itemmenu_tobottom")} />
              </ListItem>
              <ListItem button onClick={handleRemove}>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary={t("itemmenu_done")} />
              </ListItem>
              <ListItem button onClick={openListList}>
                <ListItemIcon>
                  <MoveToListIcon />
                </ListItemIcon>
                <ListItemText primary={t("itemmenu_moveto")} />
              </ListItem>
            </React.Fragment>
          )}
        </ContextDialog>
      )}
    </I18n>
  )
);
