import React from "react";
import Dialog from "@material-ui/core/Dialog";
import  DialogContent  from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";

export default ({ children, onClose }) => (
  <Dialog open={true} onClose={onClose}>
    <DialogContent>
      <List>{children}</List>
    </DialogContent>
  </Dialog>
);
