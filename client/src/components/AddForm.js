import React from "react";
import Input, { InputAdornment } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import IconButton from "material-ui/IconButton";
import Send from "material-ui-icons/Send";

import inputForm from "./InputForm";

export default inputForm(
  ({
    text,
    initialText,
    placeholder,
    handleChangeText,
    handleSubmit,
    onClose
  }) => (
    <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
      <FormControl fullWidth>
        <Input
          type="text"
          autoFocus
          placeholder={placeholder}
          value={text !== undefined ? text : initialText || ""}
          onChange={handleChangeText}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSubmit}>
                <Send />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  )
);
