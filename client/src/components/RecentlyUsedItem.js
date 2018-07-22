import React from "react";
import { withHandlers } from "recompose";
import { connect } from "react-redux";
import buildHandlers, {
  addStackableItem,
  removeRecentlyUsedItem
} from "../redux/actions";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Add from "@material-ui/icons/Restore";
import Remove from "@material-ui/icons/Delete";
import compose from "ramda/src/compose";

export const RecentlyUsedItem = ({ entry, addItem, deleteItem }) => (
  <ListItem>
    <ListItemText primary={entry} />
    <ListItemIcon onClick={addItem}>
      <IconButton>
        <Add />
      </IconButton>
    </ListItemIcon>
    <ListItemIcon onClick={deleteItem}>
      <IconButton>
        <Remove />
      </IconButton>
    </ListItemIcon>
  </ListItem>
);

export default compose(
  connect(
    () => ({}),
    buildHandlers({
      addStackableItem,
      removeRecentlyUsedItem
    })
  ),
  withHandlers({
    addItem: ({ addStackableItem, entry }) => e => {
      addStackableItem(entry);
    },
    deleteItem: ({ removeRecentlyUsedItem, entry }) => e => {
      removeRecentlyUsedItem(entry);
    }
  })
)(RecentlyUsedItem);
