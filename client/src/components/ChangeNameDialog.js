import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import inputForm from "./InputForm";

export default inputForm(
  ({ text, initialText, handleChangeText, handleSubmit, onClose }) => (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="editField"
            fullWidth
            autoFocus
            value={text !== undefined ? text : initialText || ""}
            onChange={handleChangeText}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button color="primary" onClick={handleSubmit}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
);
