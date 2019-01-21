import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { I18n } from "react-i18next";

import inputForm from "./InputForm";

export default inputForm(
  ({
    text,
    initialText,
    placeholder,
    handleChangeText,
    handleSubmit,
    onClose,
    buttonLabel
  }) => (
    <form
      onSubmit={handleSubmit}
      style={{
        margin: "10px auto",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        maxWidth: 400
      }}
    >
      <I18n>
        {t => (
          <TextField
            label={t("serverpassword_label")}
            type="password"
            autoComplete="current-password"
            margin="normal"
            value={text !== undefined ? text : initialText || ""}
            onChange={handleChangeText}
          />
        )}
      </I18n>
      <Button onClick={handleSubmit}>{buttonLabel}</Button>
    </form>
  )
);
