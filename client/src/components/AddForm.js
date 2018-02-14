import React from "react";
import Input, { InputAdornment } from "material-ui/Input";
import List from "material-ui/List";
import { FormControl } from "material-ui/Form";
import IconButton from "material-ui/IconButton";
import Send from "material-ui-icons/Send";
import { withState, withHandlers } from "recompose";
import compose from "ramda/src/compose";
import { Shortcuts } from "react-shortcuts";

import suggestionEngine from "./SuggestionEngine";
import inputForm from "./InputForm";
import AddableItem from "./AddableItem";

export default compose(
  inputForm,
  withState("inputRef", "setInputRef"),
  withHandlers({
    focusInput: ({ inputRef }) => () => inputRef.focus()
  }),
  withHandlers({
    handleShortcuts: ({ focusInput }) => (action, event) => {
      switch (action) {
        case "FOCUS_INPUT":
          focusInput();
          break;
        default:
          break;
      }
    },
    onAddSuggestion: ({ focusInput, clearText }) => () => {
      clearText();
      focusInput();
    },
    onSubmitText: ({ focusInput, clearText, handleSubmit }) => e => {
      handleSubmit(e);
      focusInput();
      clearText();
    },
    handleChangeText: ({ handleChangeText, onChange, initialText }) => e => {
      handleChangeText(e);
      onChange(e.target.value || initialText);
    }
  }),
  suggestionEngine
)(
  ({
    text,
    initialText,
    placeholder,
    handleChangeText,
    onSubmitText,
    suggestions,
    onAddSuggestion,
    listId,
    onClose,
    handleShortcuts,
    setInputRef
  }) => (
    <Shortcuts
      name="EDIT_VIEW"
      stopPropagation={false}
      targetNodeSelector="body"
      handler={handleShortcuts}
    >
      <form onSubmit={onSubmitText} style={{ margin: "10px" }}>
        <FormControl fullWidth>
          <Input
            type="text"
            inputRef={setInputRef}
            placeholder={placeholder}
            value={text !== undefined ? text : initialText || ""}
            onChange={handleChangeText}
            endAdornment={
              <InputAdornment position="end">
                <IconButton tabIndex={-1} onClick={onSubmitText}>
                  <Send />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </form>
      {suggestions.length > 0 && (
        <List
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            backgroundColor: "white",
            boxShadow: "0px 6px 6px -6px rgba(0,0,0,0.25)"
          }}
        >
          {suggestions.map(suggestion => (
            <AddableItem
              onAdd={onAddSuggestion}
              listId={listId}
              key={suggestion}
              entry={suggestion}
            />
          ))}
        </List>
      )}
    </Shortcuts>
  )
);
