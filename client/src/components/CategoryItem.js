import React from "react";
import { withHandlers } from "recompose";
import List, { ListItem, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";

import AddableItem from "./AddableItem";

export default withHandlers({
  handleToggle: ({ category, toggle }) => () => toggle(category)
})(({ category, entries, handleToggle, listId, open }) => (
  <React.Fragment>
    <ListItem button onClick={handleToggle}>
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
