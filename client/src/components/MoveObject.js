import { withHandlers } from "recompose";

export default (handlerProp, lookup) =>
  withHandlers({
    onSortEnd: props => ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) return;
      props[handlerProp](lookup(props, oldIndex), lookup(props, newIndex));
    }
  });
