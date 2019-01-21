import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { I18n } from "react-i18next";

export default 
  ({ label, onSubmit, onClose }) => (
    <I18n>{t =>
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <Typography>{label}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("confirmdialog_cancel")}</Button>
        <Button color="primary" onClick={onSubmit}>
          {t("confirmdialog_confirm")}
        </Button>
      </DialogActions>
    </Dialog>
    }</I18n>
  )
;
