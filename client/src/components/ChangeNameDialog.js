import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { I18n } from "react-i18next";

import inputForm from "./InputForm";

export default inputForm(
  ({ text, initialText, handleChangeText, handleSubmit, onClose }) => (
    <I18n>
      {t => (
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
            <Button onClick={onClose}>{t("namedialog_cancel")}</Button>
            <Button color="primary" onClick={handleSubmit}>
              {t("namedialog_confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </I18n>
  )
);
