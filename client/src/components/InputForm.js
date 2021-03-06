import { withState, withProps } from "recompose";
import { compose } from "redux";

const textHandler = withState("text", "storeText", undefined);
const submitHandler = withProps(ownerProps => ({
  handleSubmit: e => {
    e.preventDefault();
    ownerProps.onSubmit(ownerProps.text || ownerProps.initialText);
    ownerProps.storeText(ownerProps.initialText || "");
  },
  handleChangeText: e => {
    ownerProps.storeText(e.target.value);
  },
  clearText: () => ownerProps.storeText("")
}));

export default compose(textHandler, submitHandler);
