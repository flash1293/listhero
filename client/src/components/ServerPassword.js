import React from "react";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

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
      <TextField
        label="Server-Passwort"
        type="password"
        autoComplete="current-password"
        margin="normal"
        value={text !== undefined ? text : initialText || ""}
        onChange={handleChangeText}
      />
      <Button onClick={handleSubmit}>{buttonLabel}</Button>
    </form>
  )
);
