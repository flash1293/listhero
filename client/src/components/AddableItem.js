import React from "react";
import { withHandlers } from "recompose";
import { connect } from "react-redux";
import buildHandlers, { addStackableItem } from "../redux/actions";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Add from "@material-ui/icons/Add";
import compose from "ramda/src/compose";

export const AddableItem = ({ entry, inset, addItem }) => (
  <ListItem
    button
    onClick={addItem}
    style={inset ? { paddingLeft: "38px", paddingRight: 0 } : {}}
  >
    <ListItemText primary={entry} />
    <ListItemIcon>
      <Add />
    </ListItemIcon>
  </ListItem>
);

export default compose(
  connect(
    () => ({}),
    buildHandlers({
      addStackableItem
    })
  ),
  withHandlers({
    addItem: ({ addStackableItem, entry, onAdd }) => e => {
      addStackableItem(entry);
      if (typeof onAdd === "function") onAdd(entry);
    }
  })
)(AddableItem);
