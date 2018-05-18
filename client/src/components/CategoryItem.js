import React from "react";
import { withHandlers } from "recompose";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import AddableItem from "./AddableItem";

export default withHandlers({
  handleRemove: ({ category, toggle }) => () => toggle(category)
})(({ category, entries, handleRemove, listId, open }) => (
  <React.Fragment>
    <ListItem button onClick={handleRemove}>
      <ListItemText primary={category} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse component="li" in={open} timeout="auto" unmountOnExit>
      <List disablePadding>
        {entries.map((entry, index) => (
          <AddableItem key={entry} entry={entry} listId={listId} inset />
        ))}
      </List>
    </Collapse>
  </React.Fragment>
));
