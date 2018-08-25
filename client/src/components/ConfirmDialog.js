import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default 
  ({ label, onSubmit, onClose }) => (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <Typography>{label}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button color="primary" onClick={onSubmit}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
;
