import React from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Send from "@material-ui/icons/Send";
import { withState, withHandlers, lifecycle } from "recompose";
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
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if(nextProps.listId !== this.props.listId) {
        // remove current text from input field to fill it with the initial value
        // (thats what you get for local state)
        this.props.storeText(undefined);
      }
    }
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
    handleChangeText: ({ handleChangeText, onChange }) => e => {
      handleChangeText(e);
      onChange(e.target.value);
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
