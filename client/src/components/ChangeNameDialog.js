import React from "react";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import inputForm from "./InputForm";

export default inputForm(
  ({ text, initialText, handleChangeText, handleSubmit, onClose }) => (
    <Dialog open={true} onRequestClose={onClose}>
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
