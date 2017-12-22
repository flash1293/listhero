import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import List from "material-ui/List";

export default ({ children, onClose }) => (
  <Dialog open={true} onRequestClose={onClose}>
    <DialogContent>
      <List>{children}</List>
    </DialogContent>
  </Dialog>
);
