import React from "react";
import Dialog, { DialogContent } from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";

export default ({ children, onClose }) => (
  <Dialog open={true} onRequestClose={onClose}>
    <DialogContent>
      <List>{children}</List>
    </DialogContent>
  </Dialog>
);
